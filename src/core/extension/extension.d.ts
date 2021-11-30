declare global {  
    namespace Laya{
        interface Sprite3D {  
            fullname: string;
        }
    }

    namespace qg{
        function createCamera():any;
        function createFaceDetector():any;
        function showModal(obj:any):any;
        function openSetting(obj:any):any;
        function setKeepScreenOn(obj:any):any;
    }
}  
export { };

