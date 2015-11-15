angular.module('testappApp').controller('CarouselCtrl', function ($scope,$rootScope,$sce) {
  $scope.myInterval = 5000;
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
    var urlTemplate = '<img src="https://maps.googleapis.com/maps/api/staticmap?markers=|{long},{short}&center={long},{short}&zoom=16&scale=2&maptype=roadmap&format=png&visual_refresh=true&size=300x200"  alt="{navn}"></div>'
    var finalUrl = urlTemplate.templater({long:long,short:short,navn:tilbud.butik.navn});
    return finalUrl;
  };

  var createInstagramCode = function (instagramUrl) {
    var template =   "<style>.embed-container {position: relative; padding-bottom: 120%; height: 0; overflow: hidden;} .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='{src}' frameborder='0' scrolling='no' allowtransparency='true'></iframe></div>";
    var finalCode = template.templater({src:instagramUrl});
    return finalCode;
  };




  addTilbud = function(tilbud) {
    if (!$scope.slides.length > 0) {
      $scope.slides.push({
        content: $sce.trustAsHtml(createMapUrl(tilbud))
      })
      if (tilbud.billede1) {
        $scope.slides.push({
          content: $sce.trustAsHtml(createInstagramCode(tilbud.billede1))
        })
        if (tilbud.billede2) {
          $scope.slides.push({
            content: $sce.trustAsHtml(createInstagramCode(tilbud.billede2))
          })
        }
      }

    }
  }

})
