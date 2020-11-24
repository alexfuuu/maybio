/*
 *  GPU PS Object
 *  author av(Sehyun Kim)
 *
 *  av.seoul@gmail.com
 *  http://kimsehyun.kr
 */

THREE.PS_01 = function (_options) {
    var self = this;
    var options = _options || {};
    var pi = 3.14159265;
    self.slice = options.slice || 24;
    self.segment = options.segment || 48;
    self.PARTICLE_COUNT = self.slice * self.segment;
    self.pVertices = new Float32Array(self.PARTICLE_COUNT * 3);
    self.radius = options.radius || 0.8;
    self.buffer = new THREE.BufferGeometry();
    self.ps; //<-'praticlesystem' will be point cloud

    //get shaders
    var PS_01_vert = options.ps01vert;
    var PS_01_frag = options.ps01frag;

    /* extend Object3D */
    THREE.Object3D.apply(this, arguments);

    //set material
    self.mat = new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
            'uTime': {
                type: 'f',
                value: 0.0
            },
            'uIndex': {
                type: 'i',
                value: 0
            },
            'uTotalIndices': {
                type: 'i',
                value: 0
            },
            'uTreble': {
                type: 'f',
                value: 0.0
            }
        },
        blending: 'THREE.AddictiveBlending',
        depthWrite: true,
        vertexShader: PS_01_vert,
        fragmentShader: PS_01_frag
    });

    //-append vertices
    for (var v = 0; v < self.slice - 1; v++) {
        for (var u = 0; u < self.segment; u++) {
            var i = u + v * self.segment;
            var theta = 2 * pi * u / self.segment;
            var phi = pi * v / (self.slice - 1) - pi / 2;
            var radius = self.radius;

            var px = Math.cos(phi) * Math.cos(theta) * radius;
            var py = Math.cos(phi) * Math.sin(theta) * radius;
            var pz = Math.sin(phi) * radius;

            self.pVertices[i * 3 + 0] = px;
            self.pVertices[i * 3 + 1] = py;
            self.pVertices[i * 3 + 2] = pz;
        }
    }

    //-tell shader about default attribute
    var aBass = new Float32Array(self.PARTICLE_COUNT);
    var treble = new Float32Array(self.PARTICLE_COUNT);
    self.buffer.addAttribute('position', new THREE.BufferAttribute(self.pVertices, 3));
    self.buffer.addAttribute('aBass', new THREE.BufferAttribute(aBass, 1).setDynamic(true));

    /* init */
    this.init = function () {
        //-particle system with point cloud
        self.ps = new THREE.Points(self.buffer, self.mat);
        this.add(self.ps);
    };

    this.update = function (time, index, total, _in_01, _treble) {
        self.mat.uniforms['uTime'].value = time;
        self.mat.uniforms['uIndex'].value = index;
        self.mat.uniforms['uTotalIndices'].value = total;
        self.mat.uniforms['uTreble'].value = _treble;

        var i1 = aBass;
        for (var i = 0; i < self.PARTICLE_COUNT; i++) {
            //update base
            if (i1[i] > .0000000000000011) {
                i1[i] *= 0.96;
                if (i1[i] < .000000000000001) {
                    i1[i] = 0;
                }
            } else {
                var index = Math.floor(Math.random() * self.PARTICLE_COUNT);
                var trigger = 40;
                if (index % i == 0 && _in_01 > trigger || index % i == 1 && _in_01 > trigger) {
                    i1[index] = _in_01;
                }
            }
        }
        self.buffer.attributes.aBass.needsUpdate = true;
    };

    //excute init()
    this.init();
};

THREE.PS_01.prototype = Object.create(THREE.Object3D.prototype);
THREE.PS_01.prototype.constructor = THREE.PS_01;


THREE.PS_02 = function (_options) {
    var self = this;
    var options = _options || {};
    var pi = 3.14159265;
    self.slice = options.slice || 24;
    self.segment = options.segment || 48;
    self.PARTICLE_COUNT = self.slice * self.segment;
    self.pVertices = new Float32Array(self.PARTICLE_COUNT * 3);
    self.radius = options.radius || 0.8;
    self.buffer = new THREE.BufferGeometry();
    self.ps; //<-'praticlesystem' will be point cloud
    //get shaders
    var PS_02_vert = options.ps02vert;
    var PS_02_frag = options.ps02frag;
    /* extend Object3D */
    THREE.Object3D.apply(this, arguments);
    /* set material */
    self.mat = new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
            'uTime': {
                type: 'f',
                value: 0.0
            },
            'uBase': {
                type: 'f',
                value: 0
            }
        },
        blending: 'THREE.AddictiveBlending',
        depthWrite: true,
        vertexShader: PS_02_vert,
        fragmentShader: PS_02_frag
    });
    //-append vertices to position attribute
    for (var v = 0; v < self.slice - 1; v++) {
        for (var u = 0; u < self.segment; u++) {
            var i = u + v * self.segment;
            var theta = 2 * pi * u / self.segment;
            var phi = pi * v / (self.slice - 1) - pi / 2;
            var radius = self.radius;
            var px = Math.cos(phi) * Math.cos(theta) * radius;
            var py = Math.cos(phi) * Math.sin(theta) * radius;
            var pz = Math.sin(phi) * radius;
            self.pVertices[i * 3 + 0] = px;
            self.pVertices[i * 3 + 1] = py;
            self.pVertices[i * 3 + 2] = pz;
        }
    }
    /* set attributes */
    var randomTrigger = new Float32Array(self.PARTICLE_COUNT);
    self.buffer.addAttribute('randomTrigger', new THREE.BufferAttribute(randomTrigger, 1));
    self.buffer.addAttribute('position', new THREE.BufferAttribute(self.pVertices, 3));
    /* init */
    this.init = function () {
        self.ps = new THREE.Points(self.buffer, self.mat);
        this.add(self.ps);
    };
    /* update */
    this.update = function (time, _in_01) {
        //-update unifomrs
        self.mat.uniforms['uTime'].value = time;
        self.mat.uniforms['uBase'].value = _in_01;
        //-update attributes
        for (var i = 0; i < self.PARTICLE_COUNT; i++) {
            var rullet = Math.round(Math.random() - .9);
            randomTrigger[i] = rullet;
            //console.log(rullet);
        }
        /* set dynamic attributes */
        self.buffer.attributes.randomTrigger.needsUpdate = true;
    };
    this.init();
};
/* connect to threejs library */
THREE.PS_02.prototype = Object.create(THREE.Object3D.prototype);
THREE.PS_02.prototype.constructor = THREE.PS_02;