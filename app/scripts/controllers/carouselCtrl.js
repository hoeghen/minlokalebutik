angular.module('testappApp').controller('CarouselCtrl', function ($scope,$rootScope,$sce) {
  $scope.myInterval = 3000;
  $scope.noWrapSlides = false;
  $scope.slides = [];
  $scope.cnt = 0;
  $scope.detailTilbud;

  // event is handled by all carousel instances
  $scope.$watch("tilbud.showdetails", function (newVal,oldVal) {
    addTilbud($scope.tilbud);
    $scope.cnt++;
  })


  var createMapUrl = function (tilbud) {
    var long = tilbud.position[0];
    var short = tilbud.position[1];
    var urlTemplate = '<img src="https://maps.googleapis.com/maps/api/staticmap?markers=|{long},{short}&center={long},{short}&zoom=16&scale=2&maptype=roadmap&format=png&visual_refresh=true&size=320x320"  alt="{navn}"></div>'
    var finalUrl = urlTemplate.templater({long:long,short:short,navn:tilbud.butik.navn});
    return finalUrl;
  };

  var prepareImageLink = function (imageUrl) {
    // handle instagram urls and others
    var imageUrl = URI(imageUrl);
    var cleanUrl;
    if(imageUrl.domain() == "instagram.com"){
      cleanUrl = imageUrl.segment(2,"media").query("size=l").toString();
    }else{
      cleanUrl = imageUrl.toString();
    }
    var template =   '<img src="{shorturl}">';
    var finalCode = template.templater({shorturl:cleanUrl});
    return finalCode;
  };




  addTilbud = function(tilbud) {
    if (!$scope.slides.length > 0) {
        if (tilbud.billede1 && tilbud.billede1.trim().length > 0) {
          $scope.slides.push({
            content: $sce.trustAsHtml(prepareImageLink(tilbud.billede1))
          })
        }
        if (tilbud.billede2 && tilbud.billede1.trim().length > 0) {
          $scope.slides.push({
            content: $sce.trustAsHtml(prepareImageLink(tilbud.billede2))
          })
        }
        $scope.slides.push({
          content: $sce.trustAsHtml(createMapUrl(tilbud))
        })

      }

  }

})
