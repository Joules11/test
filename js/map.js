//if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var container, stats;
var camera, scene, renderer;
init();
animate();

function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.y = 400;
    scene = new THREE.Scene();
    var light, object;
    scene.add( new THREE.AmbientLight( 0x404040 ) );
    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 1, 0 );
    scene.add( light );
    
    
    // terrain
    var img = new Image();
    img.onload = function () {

        //get height data from img
        var data = getHeightData(img,2);

        // plane
        var geometry = new THREE.PlaneGeometry(500,500,99,99);
        var texture = THREE.ImageUtils.loadTexture( 'textures/vue.jpg' );
        var material = new THREE.MeshLambertMaterial( { map: texture } );
        plane = new THREE.Mesh( geometry, material );

        //set height of vertices
        for ( var i = 0; i<plane.geometry.vertices.length; i++ ) {
             plane.geometry.vertices[i].z = data[i];
        }
        plane.position.set( 0, 0, 0 );
        //plane.rotation.x = Math.PI / 2 ;
        plane.rotation.x = THREE.Math.degToRad( -90 );
        scene.add(plane);

    };
    // load img source
    img.src = "textures/bump.jpg";
    
    var map = new THREE.TextureLoader().load( 'textures/vue.jpg' );
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 16;
    var material = new THREE.MeshPhongMaterial( { map: map,bumpMap: THREE.ImageUtils.loadTexture('textures/bump.jpg'),bumpScale: 5.5, side: THREE.DoubleSide } );
    
    baseCarte = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100, 9, 9 ),material);
    baseCarte.position.set( 0, 0, 0 );
    baseCarte.rotation.x = 360 ;
    //scene.add( baseCarte );
    
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
    //stats = new Stats();
    //container.appendChild( stats.dom );
    //
}
function animate() {
    requestAnimationFrame( animate );
    render();
    //stats.update();
}
function render() {
    //var timer = Date.now() * 0.0001;
    camera.position.x = 0;//Math.cos( timer ) * 800;
    camera.position.z = -400;//Math.sin( timer ) * 800;
    
    camera.lookAt( scene.position );
    /*for ( var i = 0, l = scene.children.length; i < l; i ++ ) {
        var object = scene.children[ i ];
        object.rotation.x = timer * 5;
        object.rotation.y = timer * 2.5;
    }*/
    renderer.render( scene, camera );
}

//return array with height data from img
function getHeightData(img,scale) {
  
 if (scale == undefined) scale=1;
  
    var canvas = document.createElement( 'canvas' );
    canvas.width = img.width;
    canvas.height = img.height;
    var context = canvas.getContext( '2d' );
 
    var size = img.width * img.height;
    var data = new Float32Array( size );
 
    context.drawImage(img,0,0);
 
    for ( var i = 0; i < size; i ++ ) {
        data[i] = 0
    }
 
    var imgd = context.getImageData(0, 0, img.width, img.height);
    var pix = imgd.data;
 
    var j=0;
    for (var i = 0; i<pix.length; i +=4) {
        var all = pix[i]+pix[i+1]+pix[i+2];
        data[j++] = all/(12*scale);
    }
     
    return data;
}
