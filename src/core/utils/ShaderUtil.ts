export class ShaderUtil{
    public static compileShader(model: Laya.Sprite3D) {
        if (model instanceof Laya.ShuriKenParticle3D) {
            var shuriKenParticle3D: Laya.ShuriKenParticle3D = model as Laya.ShuriKenParticle3D;
            var render: Laya.ShurikenParticleRenderer = shuriKenParticle3D.particleRenderer;
            var materials: Array<Laya.Material> = render.materials;
            for (var i: number = 0; i < materials.length; i++) {
                var mater: Laya.Material = materials[i] as Laya.Material;
                let defineDatas: Laya.DefineDatas = mater._defineDatas;
                let shader: Laya.Shader3D = mater["_shader"];
                if (!shader) continue;
                let subShaders: Laya.SubShader[] = shader["_subShaders"];
                if (!subShaders || subShaders.length <= 0) continue;
                subShaders.forEach((subShader: Laya.SubShader) => {
                    if (subShader) {
                        let passes: Laya.ShaderPass[] = subShader["_passes"];
                        if (passes && passes.length > 0) {
                            console.log("预编译 pass", passes);
                            passes.forEach((pass: Laya.ShaderPass) => { pass && pass["withCompile"](defineDatas); })
                        }
                    }
                });
            }
        }
        //递归获取子对象
        if (model.numChildren) {
            let len: number = model.numChildren;
            for (var i: number = 0; i < len; i++) {
                this.compileShader(model.getChildAt(i) as Laya.Sprite3D);
            }
        }
    }
    
    public static compileShader2(model: Laya.Sprite3D) {
        if (model instanceof Laya.ShuriKenParticle3D) {
            var shuriKenParticle3D: Laya.ShuriKenParticle3D = model as Laya.ShuriKenParticle3D;
            var render: Laya.ShurikenParticleRenderer = shuriKenParticle3D.particleRenderer;
            var materials: Array<Laya.Material> = render.materials;
            for (var i: number = 0; i < materials.length; i++) {
                var mater: Laya.Material = materials[i] as Laya.Material;
                let defineDatas: Laya.DefineDatas = mater._defineDatas;
                var deugDefines = Laya.ShaderPass["_debugDefineString"];
                // if (!deugDefines) { deugDefines = ; }
                //将defineDatas转换成宏定义数组
                Laya.Shader3D["_getNamesByDefineData"](defineDatas, deugDefines);
                if (!Config3D["_config"] && Config3D["_config"]["_multiLighting"]) {
                    var index = deugDefines.indexOf("LEGACYSINGLELIGHTING");
                    (index !== -1) && (deugDefines.splice(index, 1));
                }
                let shader: Laya.Shader3D = mater["_shader"];
                if (!shader) continue;
                let subShaders: Laya.SubShader[] = shader["_subShaders"];
                if (subShaders && subShaders.length > 0) {
                    for (let j = 0; j< subShaders.length; j++) {
                        let subShader: Laya.SubShader = subShaders[i];
                        let passes: Laya.ShaderPass[] = subShader["_passes"];
                        if (passes && passes.length > 0) {
                            for (let k = 0; k < passes.length; k++) {
                                let pass: Laya.ShaderPass = passes[i];
                                console.log("预编译", shader.name)
                                pass && Laya.Shader3D.compileShaderByDefineNames(shader.name, j, k, deugDefines);
                            }
                        }
                    }
                }
            }
        }
        //递归获取子对象
        if (model.numChildren) {
            let len: number = model.numChildren;
            for (var i: number = 0; i < len; i++) {
                this.compileShader2(model.getChildAt(i) as Laya.Sprite3D);
            }
        }
    }
}