angular.module('app.signature', [])

.controller('SignatureController', function ($scope, $rootScope, $sce, $window, $document, $location, Dashboard, $http) {

  var token = $rootScope.token || localStorage.getItem('token');

  var ephemeralPublic;
  var ephemeralPrivate;
  var passphrase = chance.sentence();
  $scope.contract = {};
  $scope.contractText;
  $scope.signed = false;
  var signaturePad;
  var signature = {};
  $scope.signature = {};
  $scope.user = {};
  $scope.user.username = $rootScope.username;
  $scope.user.userId = $rootScope.userId;
  $scope.user.fullname = $rootScope.fullname;
  $scope.col;
  $scope.contractUsers = [];
  $scope.signatories = [];

  var options = {
    numBits: 1024,
    userId: $scope.user.username,
    passphrase: passphrase
  };

  openpgp.config.show_version = false;
  openpgp.config.show_comment = false;

  openpgp.generateKeyPair(options)
  .then(function(keypair) {
      ephemeralPrivate = keypair.privateKeyArmored;
      ephemeralPublic = keypair.publicKeyArmored;
  })
  .catch(function(error) {
    console.log(error);
  });


  $http({
    method: 'POST',
    url: '/opencontract',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    data: {
      contractId: $location.search().id
    }
  }).then(function(res) {
    res.data.parties.forEach(function(party) {

      if (party.userid === $scope.user.userId) {
        $scope.user.party = party.party;
        if (party.title) $scope.user.title = party.title;
      }
    });

    if (!$scope.user.party) {
      console.error('you are not part in this contract');
      return;
    }

    $scope.signatures = res.data.parties;
    $scope.contract = res.data;
    $scope.contractText = $sce.trustAsHtml($scope.contract.latest.text);
    $scope.col = 12 / res.data.parties.length;

  }, function(res) {
    console.log(res);
  });


  $scope.handleClick = function(id) {
    $http({
      method: 'POST',
      url: '/opencontract',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      data: {
        contractId: id
      }
    }).then(function(res) {
      res.data.parties.forEach(function(party) {

        if (party.userid === $scope.user.userId) {
          $scope.user.party = party.party;
          if (party.title) $scope.user.title = party.title;
        }
      });

      if (!$scope.user.party) {
        console.error('you are not part in this contract');
        return;
      }

      $scope.signatures = res.data.parties;
      $scope.contract = res.data;
      $scope.contractText = $sce.trustAsHtml($scope.contract.latest.text);
      $scope.col = 12 / res.data.parties.length;

      console.log($scope.contract);
    }, function(res) {
      console.log(res);
    });
  };

  $('#signatureModal').on('show.bs.modal', function (e) {
    signaturePad = $("#signature").jSignature({ 'UndoButton':true });
    $("#signature").resize();
  });

  $scope.sendForm = function() {
    openpgp.config.show_version = false;
    openpgp.config.show_comment = false;

    var privateKey = openpgp.key.readArmored(ephemeralPrivate).keys[0];
    // console.log(privateKey.getPrimaryUser().user);
    privateKey.decrypt(passphrase);

    var message = $scope.contract.latest.text;

    openpgp.signClearMessage(privateKey, message)
    .then(function(result) {
      $scope.signed = true;
      var newtext = result.match("-----BEGIN PGP SIGNATURE-----([\\s\\S]*?)-----END PGP SIGNATURE-----");
      var datapair = signaturePad.jSignature("getData","svgbase64");

      signature = {
        digital: newtext[0],
        image: "data:" + datapair.join(",")
      };

      $('#signatureModal').modal('hide');

      var agreement = {
        contractId: $scope.contract.contractId,
        text: result,
        signature: signature,
        publicKey: ephemeralPublic
      };

      // let myScope = $scope;
      // $scope.$apply();

      $http({
        method: 'POST',
        url: '/signcontract',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        data: agreement
      }).then(function(res) {
        $scope.signatures = res.data.parties;

        console.log(res);
      }, function(res) {
        console.log(res);
      });
    })
    .catch(function(error) {
      console.log(error);
      $('#signatureModal').modal('hide');
    });
  };

  $scope.getDetails = function() {
    $http({
      method: 'POST',
      url: '/getusersdetails',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      data: {
        contractId: $scope.contract.contractId
      }
    }).then(function(res) {
      $scope.contractUsers = res.data.usersdetails;
      console.log(res.data.usersdetails);
    }, function(res) {
      console.log(res);
    });
  };

  $scope.prepareForSigning = function() {
    $http({
      method: 'POST',
      url: '/prepareforsignature',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      data: {
        contractId: $scope.contract.contractId,
        parties: $scope.signatories
      }
    }).then(function(res) {

      console.log(res);
    }, function(res) {
      console.log(res);
    });
  };
});
