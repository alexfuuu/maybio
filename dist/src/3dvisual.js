

/*  noise, tubulence, fractal algorithm by Ken Perlin
 *  'particle equalizer' author av(Sehyun Kim)
 *  computer graphics 2015 @itp
 *
 *  av.seoul@gmail.com
 *  http://kimsehyun.kr
 *  
 **
 */

   var  outerParticlesVertexShader = [

           'vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }',
            'vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }',
            'vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }',
            'vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }',
            'vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }',
            'float noise(vec3 P) {',
                'vec3 i0 = mod289(floor(P)), i1 = mod289(i0 + vec3(1.0));',
                'vec3 f0 = fract(P), f1 = f0 - vec3(1.0), f = fade(f0);',
                'vec4 ix = vec4(i0.x, i1.x, i0.x, i1.x), iy = vec4(i0.yy, i1.yy);',
                'vec4 iz0 = i0.zzzz, iz1 = i1.zzzz;',
                'vec4 ixy = permute(permute(ix) + iy), ixy0 = permute(ixy + iz0), ixy1 = permute(ixy + iz1);',
                'vec4 gx0 = ixy0 * (1.0 / 7.0), gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;',
                'vec4 gx1 = ixy1 * (1.0 / 7.0), gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;',
                'gx0 = fract(gx0); gx1 = fract(gx1);',
                'vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0), sz0 = step(gz0, vec4(0.0));',
                'vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1), sz1 = step(gz1, vec4(0.0));',
                'gx0 -= sz0 * (step(0.0, gx0) - 0.5); gy0 -= sz0 * (step(0.0, gy0) - 0.5);',
                'gx1 -= sz1 * (step(0.0, gx1) - 0.5); gy1 -= sz1 * (step(0.0, gy1) - 0.5);',
                'vec3 g0 = vec3(gx0.x,gy0.x,gz0.x), g1 = vec3(gx0.y,gy0.y,gz0.y),',
                'g2 = vec3(gx0.z,gy0.z,gz0.z), g3 = vec3(gx0.w,gy0.w,gz0.w),',
                'g4 = vec3(gx1.x,gy1.x,gz1.x), g5 = vec3(gx1.y,gy1.y,gz1.y),',
                'g6 = vec3(gx1.z,gy1.z,gz1.z), g7 = vec3(gx1.w,gy1.w,gz1.w);',
                'vec4 norm0 = taylorInvSqrt(vec4(dot(g0,g0), dot(g2,g2), dot(g1,g1), dot(g3,g3)));',
                'vec4 norm1 = taylorInvSqrt(vec4(dot(g4,g4), dot(g6,g6), dot(g5,g5), dot(g7,g7)));',
                'g0 *= norm0.x; g2 *= norm0.y; g1 *= norm0.z; g3 *= norm0.w;',
                'g4 *= norm1.x; g6 *= norm1.y; g5 *= norm1.z; g7 *= norm1.w;',
                'vec4 nz = mix(vec4(dot(g0, vec3(f0.x, f0.y, f0.z)), dot(g1, vec3(f1.x, f0.y, f0.z)),',
                'dot(g2, vec3(f0.x, f1.y, f0.z)), dot(g3, vec3(f1.x, f1.y, f0.z))),',
                'vec4(dot(g4, vec3(f0.x, f0.y, f1.z)), dot(g5, vec3(f1.x, f0.y, f1.z)),',
                'dot(g6, vec3(f0.x, f1.y, f1.z)), dot(g7, vec3(f1.x, f1.y, f1.z))), f.z);',
                'return 2.2 * mix(mix(nz.x,nz.z,f.y), mix(nz.y,nz.w,f.y), f.x);',
            '}',
            'float noise(vec2 P) { return noise(vec3(P, 0.0)); }',


            'varying vec4 vColor;',

            'uniform float uTime;',
            'uniform int uTotalIndices;',
            'uniform int uIndex;',
            'uniform float uTreble;',

            'attribute float aBass;',

            'void main(){',
                'vec3 mNormal = normalize(vec3(0.,0.,0.)-position);',
                'float mIn01 = aBass*.9+1.;',
                'float mNoise = 6.*-2.*noise(mNormal+uTime);',
                'float mO = float(uIndex)/float(uTotalIndices)+.1;',
                
                'float mTreble = uTreble;',
                'if(uTreble == 0.){mTreble = .01;}',


                
                'float mV = abs(.7-.5*mNoise)*.04;',
                'if(mV<0.001){mV=0.;}else if(mV>1.){mV=1.;}',                
                'mV=pow(mV,3.);',
                
                'float mBase = aBass*.9;',
                'if(mBase<0.001){mBase=0.;}else if(mBase>1.){mBase=1.;}',
                'float mR =  1.-mV*mO*.2 - mV*mO + mBase + mTreble*mV*.99+uTreble*aBass; //-root+blackring+base+treble+whity',
                'float mG = 1. - mV*mO*.5 + mBase + mTreble*mV*.99+uTreble*aBass;', 
                'float mB = 1. - mV*mO*.5 + mBase + mTreble*mV*.1+uTreble*aBass;',
                'float mA = mV*mO*1.0;',
                'vColor = vec4(mR,mG,mB,1.-mA);',                
                
                'vec3 mPos = position + mNormal*mNoise - mNormal*mIn01;',
                'gl_Position = projectionMatrix * modelViewMatrix * vec4(mPos, 1.0);',
                 
                'float mPointSize = (1.-mV)*mO;',
                'mPointSize = pow(mPointSize,2.2)*3.+pow(mBase*1.8,2.22)+mTreble*7.; //-root+base+treble',
                'gl_PointSize = mPointSize;',
            '}',

    ].join("\n");

    var outerParticlesFragmentShader = [

      'varying vec4 vColor;',
            
            'void main(){',
                'vec4 mColor = vec4(pow(vColor.rgb,vec3(2.2)), vColor.a); //-gamma correction',
                'gl_FragColor = mColor;',
            '}',

    ].join("\n");

var smallEffektVertexShader = [
    
    'vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }',
            'vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }',
            'vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }',
            'vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }',
            'vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }',
            'float noise(vec3 P) {',
                'vec3 i0 = mod289(floor(P)), i1 = mod289(i0 + vec3(1.0));',
                'vec3 f0 = fract(P), f1 = f0 - vec3(1.0), f = fade(f0);',
                'vec4 ix = vec4(i0.x, i1.x, i0.x, i1.x), iy = vec4(i0.yy, i1.yy);',
                'vec4 iz0 = i0.zzzz, iz1 = i1.zzzz;',
                'vec4 ixy = permute(permute(ix) + iy), ixy0 = permute(ixy + iz0), ixy1 = permute(ixy + iz1);',
                'vec4 gx0 = ixy0 * (1.0 / 7.0), gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;',
                'vec4 gx1 = ixy1 * (1.0 / 7.0), gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;',
                'gx0 = fract(gx0); gx1 = fract(gx1);',
                'vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0), sz0 = step(gz0, vec4(0.0));',
                'vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1), sz1 = step(gz1, vec4(0.0));',
                'gx0 -= sz0 * (step(0.0, gx0) - 0.5); gy0 -= sz0 * (step(0.0, gy0) - 0.5);',
                'gx1 -= sz1 * (step(0.0, gx1) - 0.5); gy1 -= sz1 * (step(0.0, gy1) - 0.5);',
                'vec3 g0 = vec3(gx0.x,gy0.x,gz0.x), g1 = vec3(gx0.y,gy0.y,gz0.y),',
                'g2 = vec3(gx0.z,gy0.z,gz0.z), g3 = vec3(gx0.w,gy0.w,gz0.w),',
                'g4 = vec3(gx1.x,gy1.x,gz1.x), g5 = vec3(gx1.y,gy1.y,gz1.y),',
                'g6 = vec3(gx1.z,gy1.z,gz1.z), g7 = vec3(gx1.w,gy1.w,gz1.w);',
                'vec4 norm0 = taylorInvSqrt(vec4(dot(g0,g0), dot(g2,g2), dot(g1,g1), dot(g3,g3)));',
                'vec4 norm1 = taylorInvSqrt(vec4(dot(g4,g4), dot(g6,g6), dot(g5,g5), dot(g7,g7)));',
                'g0 *= norm0.x; g2 *= norm0.y; g1 *= norm0.z; g3 *= norm0.w;',
                'g4 *= norm1.x; g6 *= norm1.y; g5 *= norm1.z; g7 *= norm1.w;',
                'vec4 nz = mix(vec4(dot(g0, vec3(f0.x, f0.y, f0.z)), dot(g1, vec3(f1.x, f0.y, f0.z)),',
                'dot(g2, vec3(f0.x, f1.y, f0.z)), dot(g3, vec3(f1.x, f1.y, f0.z))),',
                'vec4(dot(g4, vec3(f0.x, f0.y, f1.z)), dot(g5, vec3(f1.x, f0.y, f1.z)),',
                'dot(g6, vec3(f0.x, f1.y, f1.z)), dot(g7, vec3(f1.x, f1.y, f1.z))), f.z);',
                'return 2.2 * mix(mix(nz.x,nz.z,f.y), mix(nz.y,nz.w,f.y), f.x);',
            '}',
            'float noise(vec2 P) { return noise(vec3(P, 0.0)); }',
            'float fractal(vec3 P) {',
                'float f = 0., s = 1.;',
                'for (int i = 0 ; i < 9 ; i++) {',
                    'f += noise(s * P) / s;',
                    's *= 2.;',
                    'P = vec3(.866 * P.x + .5 * P.z, P.y + 100., -.5 * P.x + .866 * P.z);',
                '}',
                'return f;',
            '}',
            'float turbulence(vec3 P) {',
                'float f = 0., s = 1.;',
                'for (int i = 0 ; i < 9 ; i++) {',
                    'f += abs(noise(s * P)) / s;',
                    's *= 2.;',
                    'P = vec3(.866 * P.x + .5 * P.z, P.y + 100., -.5 * P.x + .866 * P.z);',,
                '}',
                'return f;',
            '}',
            'attribute float randomTrigger;',
            'uniform float uTime;',
            'uniform float uBase;',
            'varying float vA;',
            'varying float vG;',
            'varying float vR;',
            'void main(){',
                'vec3 mNormal = normalize(vec3(0.,0.,0.)-position);',
                'float mAlign = 3.*-2.*noise(mNormal+uTime);',
                'float mNoise = 3.*-2.*noise(position+uTime);',
                'float mBase = uBase*.015;',
                'vec3 mPos = position+mNormal*(mNoise+mAlign);',
                'gl_Position = projectionMatrix*modelViewMatrix*vec4(mPos,1.0);',
                'float mPointSize = 5.;',
                'mPointSize = mNoise*.012*mBase;',
                'gl_PointSize = pow(mPointSize,7.2);',
                'vA = pow(uBase,2.2);',
                'vR = mBase;',
                'vG = mPointSize*.1*randomTrigger;',
            '}',
      
].join("\n");  

var smallEffektFragmentShader = [
      'varying float vA;',
            'varying float vG;',
            'varying float vR;',
            'void main(){',
                'float mR = vR*.4;',
                'vec3 mColor = vec3(vG,1.,.0);',
                'mColor = pow(mColor,vec3(1./2.2));',
                'gl_FragColor = vec4( mColor, vA );',
            '}'
].join("\n"); 

var fullBubbleVertexShader = [
     'vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }',
            'vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }',
            'vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }',
            'vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }',
            'vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }',
            'float noise(vec3 P) {',
                'vec3 i0 = mod289(floor(P)), i1 = mod289(i0 + vec3(1.0));',
                'vec3 f0 = fract(P), f1 = f0 - vec3(1.0), f = fade(f0);',
                'vec4 ix = vec4(i0.x, i1.x, i0.x, i1.x), iy = vec4(i0.yy, i1.yy);',
                'vec4 iz0 = i0.zzzz, iz1 = i1.zzzz;',
                'vec4 ixy = permute(permute(ix) + iy), ixy0 = permute(ixy + iz0), ixy1 = permute(ixy + iz1);',
                'vec4 gx0 = ixy0 * (1.0 / 7.0), gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;',
                'vec4 gx1 = ixy1 * (1.0 / 7.0), gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;',
                'gx0 = fract(gx0); gx1 = fract(gx1);',
                'vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0), sz0 = step(gz0, vec4(0.0));',
                'vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1), sz1 = step(gz1, vec4(0.0));',
                'gx0 -= sz0 * (step(0.0, gx0) - 0.5); gy0 -= sz0 * (step(0.0, gy0) - 0.5);',
                'gx1 -= sz1 * (step(0.0, gx1) - 0.5); gy1 -= sz1 * (step(0.0, gy1) - 0.5);',
                'vec3 g0 = vec3(gx0.x,gy0.x,gz0.x), g1 = vec3(gx0.y,gy0.y,gz0.y),',
                'g2 = vec3(gx0.z,gy0.z,gz0.z), g3 = vec3(gx0.w,gy0.w,gz0.w),',
                'g4 = vec3(gx1.x,gy1.x,gz1.x), g5 = vec3(gx1.y,gy1.y,gz1.y),',
                'g6 = vec3(gx1.z,gy1.z,gz1.z), g7 = vec3(gx1.w,gy1.w,gz1.w);',
                'vec4 norm0 = taylorInvSqrt(vec4(dot(g0,g0), dot(g2,g2), dot(g1,g1), dot(g3,g3)));',
                'vec4 norm1 = taylorInvSqrt(vec4(dot(g4,g4), dot(g6,g6), dot(g5,g5), dot(g7,g7)));',
                'g0 *= norm0.x; g2 *= norm0.y; g1 *= norm0.z; g3 *= norm0.w;',
                'g4 *= norm1.x; g6 *= norm1.y; g5 *= norm1.z; g7 *= norm1.w;',
                'vec4 nz = mix(vec4(dot(g0, vec3(f0.x, f0.y, f0.z)), dot(g1, vec3(f1.x, f0.y, f0.z)),',
                'dot(g2, vec3(f0.x, f1.y, f0.z)), dot(g3, vec3(f1.x, f1.y, f0.z))),',
                'vec4(dot(g4, vec3(f0.x, f0.y, f1.z)), dot(g5, vec3(f1.x, f0.y, f1.z)),',
                'dot(g6, vec3(f0.x, f1.y, f1.z)), dot(g7, vec3(f1.x, f1.y, f1.z))), f.z);',
                'return 2.2 * mix(mix(nz.x,nz.z,f.y), mix(nz.y,nz.w,f.y), f.x);',
            '}',
            'float noise(vec2 P) { return noise(vec3(P, 0.0)); }',


            'varying float vNoise;',
            'uniform float uTime;',
            
            'void main(){',
                
                'vNoise = 4. * -2. * noise(normal + uTime * .5);',
                
                'float pn = .9 * noise( .015 * position + uTime);',
               
                'float displacement = vNoise + pn;',

                'vec3 mPos = position + normal * displacement;',
                'gl_Position = projectionMatrix * modelViewMatrix * vec4(mPos, 1.0);',
            '}'
].join("\n"); 

var fullBubbleFragmentShader = [
    'varying float vNoise;',
            'uniform sampler2D uTex;',
            'uniform float uIn_01;',
            'uniform float uTime;',
            'uniform float uTreble;',
            
            'float random(vec3 scale,float seed){return fract(sin(dot(gl_FragCoord.xyz+seed,scale))*43758.5453+seed);}',
            
            'void main(){',
                'float mIn_01 = uIn_01 * .95;',
                'float r = .01 * random( vec3( 8.9898, 8.233, 8.7182 ), 5.0 );',
                'vec2 mUv = vec2( 0., 1.02 - .32 * vNoise * r );',      
                'float mR = mUv.y * ( .3 - .1 * vNoise );',
                'float mGB = (1. - mUv.y) * ( .9 - .1 * vNoise ) * mIn_01 * .8;',
                'float mEnergy = mGB * uTreble * .5;',
                'vec3 mColor = vec3(  mGB*.1 + mEnergy, mR + mGB * 1. + mEnergy, 1. - mGB*.0 + mEnergy*.5 );', 
                'gl_FragColor = vec4( 1. - mColor, 1. );',
            '}'
].join("\n"); 

var gitterVertexShader = [
  'vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }',
            'vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }',
            'vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }',
            'vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }',
            'vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }',
            'float noise(vec3 P) {',
                'vec3 i0 = mod289(floor(P)), i1 = mod289(i0 + vec3(1.0));',
                'vec3 f0 = fract(P), f1 = f0 - vec3(1.0), f = fade(f0);',
                'vec4 ix = vec4(i0.x, i1.x, i0.x, i1.x), iy = vec4(i0.yy, i1.yy);',
                'vec4 iz0 = i0.zzzz, iz1 = i1.zzzz;',
                'vec4 ixy = permute(permute(ix) + iy), ixy0 = permute(ixy + iz0), ixy1 = permute(ixy + iz1);',
                'vec4 gx0 = ixy0 * (1.0 / 7.0), gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;',
                'vec4 gx1 = ixy1 * (1.0 / 7.0), gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;',
                'gx0 = fract(gx0); gx1 = fract(gx1);',
                'vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0), sz0 = step(gz0, vec4(0.0));',
                'vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1), sz1 = step(gz1, vec4(0.0));',
                'gx0 -= sz0 * (step(0.0, gx0) - 0.5); gy0 -= sz0 * (step(0.0, gy0) - 0.5);',
                'gx1 -= sz1 * (step(0.0, gx1) - 0.5); gy1 -= sz1 * (step(0.0, gy1) - 0.5);',
                'vec3 g0 = vec3(gx0.x,gy0.x,gz0.x), g1 = vec3(gx0.y,gy0.y,gz0.y),',
                'g2 = vec3(gx0.z,gy0.z,gz0.z), g3 = vec3(gx0.w,gy0.w,gz0.w),',
                'g4 = vec3(gx1.x,gy1.x,gz1.x), g5 = vec3(gx1.y,gy1.y,gz1.y),',
                'g6 = vec3(gx1.z,gy1.z,gz1.z), g7 = vec3(gx1.w,gy1.w,gz1.w);',
                'vec4 norm0 = taylorInvSqrt(vec4(dot(g0,g0), dot(g2,g2), dot(g1,g1), dot(g3,g3)));',
                'vec4 norm1 = taylorInvSqrt(vec4(dot(g4,g4), dot(g6,g6), dot(g5,g5), dot(g7,g7)));',
                'g0 *= norm0.x; g2 *= norm0.y; g1 *= norm0.z; g3 *= norm0.w;',
                'g4 *= norm1.x; g6 *= norm1.y; g5 *= norm1.z; g7 *= norm1.w;',
                'vec4 nz = mix(vec4(dot(g0, vec3(f0.x, f0.y, f0.z)), dot(g1, vec3(f1.x, f0.y, f0.z)),',
                'dot(g2, vec3(f0.x, f1.y, f0.z)), dot(g3, vec3(f1.x, f1.y, f0.z))),',
                'vec4(dot(g4, vec3(f0.x, f0.y, f1.z)), dot(g5, vec3(f1.x, f0.y, f1.z)),',
                'dot(g6, vec3(f0.x, f1.y, f1.z)), dot(g7, vec3(f1.x, f1.y, f1.z))), f.z);',
                'return 2.2 * mix(mix(nz.x,nz.z,f.y), mix(nz.y,nz.w,f.y), f.x);',
            '}',
            'float noise(vec2 P) { return noise(vec3(P, 0.0)); }',


            'varying float vNoise;',
            'uniform float uTime;',
            
            'void main(){',
                'vNoise = 2. * -2. * noise(normal + uTime * .5);',
                'float pn = .9 * noise( .015 * position + uTime);',
                'float displacement = vNoise + pn;',

                'vec3 mPos = position + normal * displacement;',
                'gl_Position = projectionMatrix * modelViewMatrix * vec4(mPos, 1.0);',
            '}'
].join("\n");

var gitterFragmentShader = [
            'varying float vNoise;',
            'uniform sampler2D uTex;',
            'uniform float uIn_01;',
            'uniform float uTime;',
            'uniform float uTreble;',
            
            'float random(vec3 scale,float seed){return fract(sin(dot(gl_FragCoord.xyz+seed,scale))*43758.5453+seed);}',
            
            'void main(){',
                'float mIn_01 = uIn_01 * .15;',
                'float r = .0001 * random( vec3( 12.9898, 78.233, 151.7182 ), 0.0 );',
                'vec2 mUv = vec2( 0., 1.02 - .32 * vNoise * r );',
                'float mR = mUv.y * ( .2 - .02 * vNoise );',
                'float mGB = (1. - mUv.y) * ( .05 - .1 * vNoise ) * mIn_01 * .8;',
                'float mEnergy = mGB * uTreble * .5;',
                'vec3 mColor = vec3(  mGB*.9 + mEnergy, mR + mGB * 1. + mEnergy, 1. - mGB*.0 + mEnergy*.5 );',
                'gl_FragColor = vec4( 1. - mColor, .3 );',
            '}'
].join("\n");


var width, height, ratio, group_01, group_02, group_03, group_04, scene, camera, renderer, container, 
    mouseX, mouseY, clock, mPS_02, mPS_01, PS_01_size, mDS_01_mat, mDS_01_mesh, life, lifeTarget, tick, tick_pre, treble, controls;
var  nR=1;
var start = Date.now();
var options, spawnerOptions, particleSystem;

var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var radius;
if(window.innerHeight<800){radius = window.innerHeight/100+7;}
else{radius =10;}


var init = function(){

    life = 0;
    lifeTarget = 0;
    tick = 0;
    tick_pre_01 = 0;
    tick_pre_02 = 0;
    tick_pre_03 = 0;

    width = window.innerWidth;
    height = window.innerHeight;
    ratio = window.devicePixelRatio;

    scene = new THREE.Scene();
    group_01 = new THREE.Object3D();
    group_02 = new THREE.Object3D();
    group_03 = new THREE.Object3D();
    group_04 = new THREE.Object3D();
    camera = new THREE.PerspectiveCamera( 35, width/height, 0.1, 10000);
    camera.position.y = -7;
    renderer = new THREE.WebGLRenderer({  alpha: true,  antialias: true });
    clock = new THREE.Clock(true);
    container = document.getElementById('visual');
    /*controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = false;
    controls.dampingFactor = 0.25;
    controls.enableZoom = false;
    //controls.noZoom = true;
    controls.minDistance = 30;
    */

    
    
    PS_01_size = 2;
    mPS_01 = [PS_01_size];
    tick_pre = [PS_01_size];
    for(var i = 0; i < PS_01_size; i++){
        mPS_01[i] = new THREE.PS_01({
            'slice': 100,
            'segment': 150,
            'ps01vert': outerParticlesVertexShader,
            'ps01frag': outerParticlesFragmentShader,
            'radius': radius
        });

        tick_pre[i] = 0;
    }

    
    
    mPS_02 = new THREE.PS_02({
        'slice': 100,
        'segment': 100,
        'ps02vert': smallEffektVertexShader,
        'ps02frag': smallEffektFragmentShader,
        'radius': radius
    });

    mDS_01_mat = new THREE.ShaderMaterial({
        transparent: true,
       
        depthWrite: true,
        uniforms:{
            'uTime': { type: 'f', value: 0.0 },
            'uIn_01': { type: 'f', value: 0.0 },
            'uTreble': { type: 'f', value: 0.0 }
        },
        vertexShader: fullBubbleVertexShader,
        fragmentShader: fullBubbleFragmentShader
    });
    
    bg_gitter_material = new THREE.ShaderMaterial({
        transparent: true,
        
        depthWrite: true,
        wireframe:true,
        opacity: 0.1,
        uniforms:{
            'uTime': { type: 'f', value: 700.0 },
            'uIn_01': { type: 'f', value: 3.0 },
            'uTreble': { type: 'f', value: 0.0 },
            color: { type: "c", value: new THREE.Color(0x00ff00) }
        },
        vertexShader: gitterVertexShader, 
         fragmentShader: gitterFragmentShader
    });
    var mDS_01_geo = new THREE.SphereGeometry( radius, 128, 128 );
    mDS_01_mesh = new THREE.Mesh( mDS_01_geo, mDS_01_mat );
    
    var bg_gitter = new THREE.SphereGeometry( radius, 108, 108 );
     bg_gitter_mesh = new THREE.Mesh( bg_gitter, bg_gitter_material );
    
    
    group_04.add( mDS_01_mesh );
    for(var i = 0; i < PS_01_size; i++){
        group_01.add( mPS_01[i] );
    }
    group_01.add( mPS_02 );
    group_03.add( group_04 );
    group_03.add( group_01 );
    group_03.add( group_02 );    
   
      // options passed during each spawned
      options = {
        position: new THREE.Vector3(),
        positionRandomness: 0.5,
        velocity: new THREE.Vector3(),
        velocityRandomness: .4,
        color: 0xffffff,
        colorRandomness: .0,
        turbulence: 7.9,
        lifetime: 12,
        size: 5 
      };

      spawnerOptions = {
        spawnRate: 15000,
        horizontalSpeed: 5.5,
        verticalSpeed: 5.33,
        timeScale: 1
      }
    
    
    
    
    //-set camera's default distance
    renderer.setPixelRatio(ratio);
    renderer.setSize(width, height+200);
    camera.position.z = 100;


    scene.add( group_03 );
    
   
   
    
    container.appendChild(renderer.domElement); 
    
    
    window.addEventListener( 'resize', onWindowResize, false );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    
    //document.addEventListener( 'touchstart', onDocumentTouchStart, false );
    //document.addEventListener( 'touchmove', onDocumentTouchMove, false );
};


function onDocumentMouseMove(event) {

    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;


}

function onDocumentTouchStart(event) {

    if (event.touches.length === 1) {

        event.preventDefault();

        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;

    }

}

function onDocumentTouchMove(event) {

    if (event.touches.length === 1) {

        event.preventDefault();

        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;

    }

}

function onWindowResize(event) {

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    

        renderer.setSize(width, height);
        


}

$(window).scroll(function(){
    var scrolled = $(document).scrollTop();
    if(scrolled < 810){
        camera.position.z = -scrolled/12+100;
    }
});



var render = function(){
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
     var scrolled = $(document).scrollTop();
    var slower = 1;
    if(scrolled>1550){scrolled = 1650; slower = 0.3;}else{}
    var delta = clock.getDelta() - (scrolled/100000);
    tick += delta;
    if(tick < 0){ tick = 0; }

    /* update tick for trails object */
    for(var i = PS_01_size -1; i >= 0; i--){
        if(i != 0 ){
            tick_pre[i] = tick_pre[i-1];
        } else if (i == 0){
            tick_pre[i] = tick;
        }
    }
    /* ger random number for particle's life span */
    if(life > lifeTarget) {
        life = 0;
        lifeTarget = Math.random() * 75 + 10;
    } else {
        life += .5;
    }
  
    

                group_01.rotation.y += .003*slower ;
                group_01.rotation.x += .001*slower ;
                group_02.rotation.y -= .003*slower ;
                group_04.rotation.y += .003*slower ;
                group_04.rotation.x += .001*slower ;                

    /* update objects */
    for(var i = 0; i < PS_01_size; i++){
        mPS_01[i].update( tick_pre[i], i, PS_01_size, 0, 0 );
    }
    mPS_02.update( tick, 0 );
 
    mDS_01_mat.uniforms['uTime'].value = tick;
    mDS_01_mat.uniforms['uIn_01'].value = 0;
    mDS_01_mat.uniforms['uTreble'].value = 0;
    bg_gitter_material.uniforms['uTime'].value = tick;
    mDS_01_mat.uniforms['uIn_01'].value = 0;
    bg_gitter_material.uniforms['uTreble'].value = 0;
  
    
    renderer.setClearColor( 0xffffff, 0 );
    renderer.render( scene, camera );
};
var id;
/* setting animate */
var animate = function(){
    id = requestAnimationFrame( animate );
    
   
    render();
};






var mesh, lightMesh, geometry, directionalLight;
var particleLight;
var width = window.innerWidth / 2;
var height = window.innerHeight;
var headcamera, head;
 
    

function inithead() {
    var headrenderwidth = $('#face-canvas').width();
    var headrenderheight = $('#face-canvas').height();
    headcontainer = document.getElementById("face-canvas");
    
   
    headcamera = new THREE.PerspectiveCamera(30, headrenderwidth / headrenderheight, 1, 100000);
    headcamera.position.z = 500;
    headcamera.aspect = headrenderwidth / headrenderheight;
    headcamera.updateProjectionMatrix();
    headscene = new THREE.Scene();

    /*===========================LIGHTS==============================*/

    particleLight = new THREE.Mesh(new THREE.SphereGeometry(0.01, 0.01, 0.01), new THREE.MeshBasicMaterial({
        color: 0xffffff
    }));
    particleLight2 = new THREE.Mesh(new THREE.SphereGeometry(0.01, 0.01, 0.01), new THREE.MeshBasicMaterial({
        color: 0xffffff
    }));
    headscene.add(particleLight);
    headscene.add(particleLight2);
    var pointLight = new THREE.PointLight("rgb(215, 215, 215)", 6, 300);
    var pointLight2 = new THREE.PointLight("rgb(215, 215, 215)", 6, 300);
    particleLight.add(pointLight);
    particleLight2.add(pointLight2);

    var ambientLight = new THREE.AmbientLight("rgb(105, 106, 105)");
    headscene.add(ambientLight);


    /*===========================OBJECTS==============================*/
    
    var material = new THREE.MeshBasicMaterial({
        color: "rgb(255, 255, 255)",
        wireframe: false
    });

    var texture = new THREE.Texture();
    var Loader = new THREE.ImageLoader();
    Loader.load('textures/iron.jpg', function (image) {

        texture.image = image;
       // texture.needsUpdate = true;

    });
    var head = new THREE.Mesh();
    var newQueen = new THREE.Mesh();
    var loader = new THREE.OBJLoader();
    loader.load('src/obj/head.obj', function (object) {
        object.traverse(function (child) {

            if (child instanceof THREE.Mesh) {
                var textureBody = new THREE.MeshPhongMaterial();

                 textureBody.shading = THREE.SmoothShading;
                // textureBody.bumpMap = bump;
                // textureBody.bumpScale = 0.5;
                textureBody.map = texture;
                
                child.material = textureBody;
                child.material.side = THREE.DoubleSide;
                child.geometry.computeVertexNormals();
                child.scale.x = child.scale.y = child.scale.z = 1.5;
                //child.material.wireframe = true;
            }
        });
        
        object.position.y = 0;
        object.position.x = 0;
        
        head.add(object);

        newQueen = object.clone();

       // headscene.add( head )
    });
  newQueen.material = material;

        
        
        headscene.add( newQueen );
    
    headscene.add( head );
    headrenderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        devicePixelRatio: 1
    });
    headrenderer.setPixelRatio(window.devicePixelRatio);
    headrenderer.setClearColor('rgb(255, 255, 255)', 0);
    headrenderer.shadowMap.enabled = true;
    headrenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    headrenderer.setPixelRatio(window.devicePixelRatio);
    headcontainer.appendChild(headrenderer.domElement);
    headrenderer.setSize(headrenderwidth, headrenderheight);
}



// 
var headid;
function animatehead() {
    headid = requestAnimationFrame(animatehead);
    headrender();
}

function headrender() {
    var headrenderwidth = $('#face-canvas').width();
    var headrenderheight = $('#face-canvas').height();
    headcamera.aspect = headrenderwidth / headrenderheight;
   
    headcamera.updateProjectionMatrix();
    
    particleLight.position.x = mouseX / 6;
    particleLight.position.y = -mouseY / 2;
    particleLight.position.z = 150;
    
    particleLight2.position.x = -150;
    particleLight2.position.y = mouseY / 6;
    particleLight2.position.z = -mouseY / 2;
    headcamera.position.x += (-mouseX - headcamera.position.x) * .1;
    headcamera.position.y += (mouseY - headcamera.position.y) * .1;

   

    headcamera.lookAt(headscene.position);

    headrenderer.render(headscene, headcamera);

}



 function startvisual() {

         init();
         animate();

         inithead();
         cancelAnimationFrame(headid);

 };