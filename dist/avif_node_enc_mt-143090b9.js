"use strict";
const { fetch } = require("./polyfil");

var Module = (function () {
  return function (Module) {
    Module = Module || {};
    function GROWABLE_HEAP_I8() {
      if (wasmMemory.buffer != buffer) {
        updateGlobalBufferAndViews(wasmMemory.buffer);
      }
      return HEAP8;
    }
    function GROWABLE_HEAP_U8() {
      if (wasmMemory.buffer != buffer) {
        updateGlobalBufferAndViews(wasmMemory.buffer);
      }
      return HEAPU8;
    }
    function GROWABLE_HEAP_I16() {
      if (wasmMemory.buffer != buffer) {
        updateGlobalBufferAndViews(wasmMemory.buffer);
      }
      return HEAP16;
    }
    function GROWABLE_HEAP_U16() {
      if (wasmMemory.buffer != buffer) {
        updateGlobalBufferAndViews(wasmMemory.buffer);
      }
      return HEAPU16;
    }
    function GROWABLE_HEAP_I32() {
      if (wasmMemory.buffer != buffer) {
        updateGlobalBufferAndViews(wasmMemory.buffer);
      }
      return HEAP32;
    }
    function GROWABLE_HEAP_U32() {
      if (wasmMemory.buffer != buffer) {
        updateGlobalBufferAndViews(wasmMemory.buffer);
      }
      return HEAPU32;
    }
    function GROWABLE_HEAP_F32() {
      if (wasmMemory.buffer != buffer) {
        updateGlobalBufferAndViews(wasmMemory.buffer);
      }
      return HEAPF32;
    }
    function GROWABLE_HEAP_F64() {
      if (wasmMemory.buffer != buffer) {
        updateGlobalBufferAndViews(wasmMemory.buffer);
      }
      return HEAPF64;
    }
    var Module = typeof Module !== "undefined" ? Module : {};
    var readyPromiseResolve, readyPromiseReject;
    Module["ready"] = new Promise(function (resolve, reject) {
      readyPromiseResolve = resolve;
      readyPromiseReject = reject;
    });
    var moduleOverrides = {};
    var key;
    for (key in Module) {
      if (Module.hasOwnProperty(key)) {
        moduleOverrides[key] = Module[key];
      }
    }
    var quit_ = function (status, toThrow) {
      throw toThrow;
    };
    var ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
    var ENVIRONMENT_IS_PTHREAD = Module["ENVIRONMENT_IS_PTHREAD"] || false;
    var scriptDirectory = "";
    function locateFile(path) {
      if (Module["locateFile"]) {
        return Module["locateFile"](path, scriptDirectory);
      }
      return scriptDirectory + path;
    }
    var read_, readBinary;
    var nodeFS;
    var nodePath;
    {
      if (ENVIRONMENT_IS_WORKER) {
        scriptDirectory = require("path").dirname(scriptDirectory) + "/";
      } else {
        scriptDirectory = __dirname + "/";
      }
      read_ = function shell_read(filename, binary) {
        if (!nodeFS) nodeFS = require("fs");
        if (!nodePath) nodePath = require("path");
        filename = nodePath["normalize"](filename);
        return nodeFS["readFileSync"](filename, binary ? null : "utf8");
      };
      readBinary = function readBinary(filename) {
        var ret = read_(filename, true);
        if (!ret.buffer) {
          ret = new Uint8Array(ret);
        }
        assert(ret.buffer);
        return ret;
      };
      if (process["argv"].length > 1) {
        process["argv"][1].replace(/\\/g, "/");
      }
      process["argv"].slice(2);
      quit_ = function (status) {
        process["exit"](status);
      };
      Module["inspect"] = function () {
        return "[Emscripten Module object]";
      };
      var nodeWorkerThreads;
      try {
        nodeWorkerThreads = require("worker_threads");
      } catch (e) {
        console.error(
          'The "worker_threads" module is not supported in this node.js build - perhaps a newer version is needed?'
        );
        throw e;
      }
      global.Worker = nodeWorkerThreads.Worker;
    }
    {
      if (typeof performance === "undefined") {
        global.performance = require("perf_hooks").performance;
      }
    }
    var out = Module["print"] || console.log.bind(console);
    var err = Module["printErr"] || console.warn.bind(console);
    for (key in moduleOverrides) {
      if (moduleOverrides.hasOwnProperty(key)) {
        Module[key] = moduleOverrides[key];
      }
    }
    moduleOverrides = null;
    if (Module["arguments"]) Module["arguments"];
    if (Module["thisProgram"]) Module["thisProgram"];
    if (Module["quit"]) quit_ = Module["quit"];
    var tempRet0 = 0;
    var setTempRet0 = function (value) {
      tempRet0 = value;
    };
    var getTempRet0 = function () {
      return tempRet0;
    };
    var wasmBinary;
    if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
    var noExitRuntime = Module["noExitRuntime"] || true;
    if (typeof WebAssembly !== "object") {
      abort("no native wasm support detected");
    }
    var wasmMemory;
    var wasmModule;
    var ABORT = false;
    function assert(condition, text) {
      if (!condition) {
        abort("Assertion failed: " + text);
      }
    }
    function UTF8ArrayToString(heap, idx, maxBytesToRead) {
      var endIdx = idx + maxBytesToRead;
      var str = "";
      while (!(idx >= endIdx)) {
        var u0 = heap[idx++];
        if (!u0) return str;
        if (!(u0 & 128)) {
          str += String.fromCharCode(u0);
          continue;
        }
        var u1 = heap[idx++] & 63;
        if ((u0 & 224) == 192) {
          str += String.fromCharCode(((u0 & 31) << 6) | u1);
          continue;
        }
        var u2 = heap[idx++] & 63;
        if ((u0 & 240) == 224) {
          u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
        } else {
          u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heap[idx++] & 63);
        }
        if (u0 < 65536) {
          str += String.fromCharCode(u0);
        } else {
          var ch = u0 - 65536;
          str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
        }
      }
      return str;
    }
    function UTF8ToString(ptr, maxBytesToRead) {
      return ptr
        ? UTF8ArrayToString(GROWABLE_HEAP_U8(), ptr, maxBytesToRead)
        : "";
    }
    function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
      if (!(maxBytesToWrite > 0)) return 0;
      var startIdx = outIdx;
      var endIdx = outIdx + maxBytesToWrite - 1;
      for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343) {
          var u1 = str.charCodeAt(++i);
          u = (65536 + ((u & 1023) << 10)) | (u1 & 1023);
        }
        if (u <= 127) {
          if (outIdx >= endIdx) break;
          heap[outIdx++] = u;
        } else if (u <= 2047) {
          if (outIdx + 1 >= endIdx) break;
          heap[outIdx++] = 192 | (u >> 6);
          heap[outIdx++] = 128 | (u & 63);
        } else if (u <= 65535) {
          if (outIdx + 2 >= endIdx) break;
          heap[outIdx++] = 224 | (u >> 12);
          heap[outIdx++] = 128 | ((u >> 6) & 63);
          heap[outIdx++] = 128 | (u & 63);
        } else {
          if (outIdx + 3 >= endIdx) break;
          heap[outIdx++] = 240 | (u >> 18);
          heap[outIdx++] = 128 | ((u >> 12) & 63);
          heap[outIdx++] = 128 | ((u >> 6) & 63);
          heap[outIdx++] = 128 | (u & 63);
        }
      }
      heap[outIdx] = 0;
      return outIdx - startIdx;
    }
    function stringToUTF8(str, outPtr, maxBytesToWrite) {
      return stringToUTF8Array(
        str,
        GROWABLE_HEAP_U8(),
        outPtr,
        maxBytesToWrite
      );
    }
    function lengthBytesUTF8(str) {
      var len = 0;
      for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343)
          u = (65536 + ((u & 1023) << 10)) | (str.charCodeAt(++i) & 1023);
        if (u <= 127) ++len;
        else if (u <= 2047) len += 2;
        else if (u <= 65535) len += 3;
        else len += 4;
      }
      return len;
    }
    function UTF16ToString(ptr, maxBytesToRead) {
      var str = "";
      for (var i = 0; !(i >= maxBytesToRead / 2); ++i) {
        var codeUnit = GROWABLE_HEAP_I16()[(ptr + i * 2) >> 1];
        if (codeUnit == 0) break;
        str += String.fromCharCode(codeUnit);
      }
      return str;
    }
    function stringToUTF16(str, outPtr, maxBytesToWrite) {
      if (maxBytesToWrite === undefined) {
        maxBytesToWrite = 2147483647;
      }
      if (maxBytesToWrite < 2) return 0;
      maxBytesToWrite -= 2;
      var startPtr = outPtr;
      var numCharsToWrite =
        maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length;
      for (var i = 0; i < numCharsToWrite; ++i) {
        var codeUnit = str.charCodeAt(i);
        GROWABLE_HEAP_I16()[outPtr >> 1] = codeUnit;
        outPtr += 2;
      }
      GROWABLE_HEAP_I16()[outPtr >> 1] = 0;
      return outPtr - startPtr;
    }
    function lengthBytesUTF16(str) {
      return str.length * 2;
    }
    function UTF32ToString(ptr, maxBytesToRead) {
      var i = 0;
      var str = "";
      while (!(i >= maxBytesToRead / 4)) {
        var utf32 = GROWABLE_HEAP_I32()[(ptr + i * 4) >> 2];
        if (utf32 == 0) break;
        ++i;
        if (utf32 >= 65536) {
          var ch = utf32 - 65536;
          str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
        } else {
          str += String.fromCharCode(utf32);
        }
      }
      return str;
    }
    function stringToUTF32(str, outPtr, maxBytesToWrite) {
      if (maxBytesToWrite === undefined) {
        maxBytesToWrite = 2147483647;
      }
      if (maxBytesToWrite < 4) return 0;
      var startPtr = outPtr;
      var endPtr = startPtr + maxBytesToWrite - 4;
      for (var i = 0; i < str.length; ++i) {
        var codeUnit = str.charCodeAt(i);
        if (codeUnit >= 55296 && codeUnit <= 57343) {
          var trailSurrogate = str.charCodeAt(++i);
          codeUnit =
            (65536 + ((codeUnit & 1023) << 10)) | (trailSurrogate & 1023);
        }
        GROWABLE_HEAP_I32()[outPtr >> 2] = codeUnit;
        outPtr += 4;
        if (outPtr + 4 > endPtr) break;
      }
      GROWABLE_HEAP_I32()[outPtr >> 2] = 0;
      return outPtr - startPtr;
    }
    function lengthBytesUTF32(str) {
      var len = 0;
      for (var i = 0; i < str.length; ++i) {
        var codeUnit = str.charCodeAt(i);
        if (codeUnit >= 55296 && codeUnit <= 57343) ++i;
        len += 4;
      }
      return len;
    }
    function alignUp(x, multiple) {
      if (x % multiple > 0) {
        x += multiple - (x % multiple);
      }
      return x;
    }
    var buffer,
      HEAP8,
      HEAPU8,
      HEAP16,
      HEAPU16,
      HEAP32,
      HEAPU32,
      HEAPF32,
      HEAPF64;
    if (ENVIRONMENT_IS_PTHREAD) {
      buffer = Module["buffer"];
    }
    function updateGlobalBufferAndViews(buf) {
      buffer = buf;
      Module["HEAP8"] = HEAP8 = new Int8Array(buf);
      Module["HEAP16"] = HEAP16 = new Int16Array(buf);
      Module["HEAP32"] = HEAP32 = new Int32Array(buf);
      Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
      Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
      Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
      Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
      Module["HEAPF64"] = HEAPF64 = new Float64Array(buf);
    }
    var INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 16777216;
    if (ENVIRONMENT_IS_PTHREAD) {
      wasmMemory = Module["wasmMemory"];
      buffer = Module["buffer"];
    } else {
      if (Module["wasmMemory"]) {
        wasmMemory = Module["wasmMemory"];
      } else {
        wasmMemory = new WebAssembly.Memory({
          initial: INITIAL_MEMORY / 65536,
          maximum: 2147483648 / 65536,
          shared: true,
        });
        if (!(wasmMemory.buffer instanceof SharedArrayBuffer)) {
          err(
            "requested a shared WebAssembly.Memory but the returned buffer is not a SharedArrayBuffer, indicating that while the browser has SharedArrayBuffer it does not have WebAssembly threads support - you may need to set a flag"
          );
          {
            console.log(
              "(on node you may need: --experimental-wasm-threads --experimental-wasm-bulk-memory and also use a recent version)"
            );
          }
          throw Error("bad memory");
        }
      }
    }
    if (wasmMemory) {
      buffer = wasmMemory.buffer;
    }
    INITIAL_MEMORY = buffer.byteLength;
    updateGlobalBufferAndViews(buffer);
    var wasmTable;
    var __ATPRERUN__ = [];
    var __ATINIT__ = [];
    var __ATPOSTRUN__ = [];
    function preRun() {
      if (ENVIRONMENT_IS_PTHREAD) return;
      if (Module["preRun"]) {
        if (typeof Module["preRun"] == "function")
          Module["preRun"] = [Module["preRun"]];
        while (Module["preRun"].length) {
          addOnPreRun(Module["preRun"].shift());
        }
      }
      callRuntimeCallbacks(__ATPRERUN__);
    }
    function initRuntime() {
      if (ENVIRONMENT_IS_PTHREAD) return;
      callRuntimeCallbacks(__ATINIT__);
    }
    function postRun() {
      if (ENVIRONMENT_IS_PTHREAD) return;
      if (Module["postRun"]) {
        if (typeof Module["postRun"] == "function")
          Module["postRun"] = [Module["postRun"]];
        while (Module["postRun"].length) {
          addOnPostRun(Module["postRun"].shift());
        }
      }
      callRuntimeCallbacks(__ATPOSTRUN__);
    }
    function addOnPreRun(cb) {
      __ATPRERUN__.unshift(cb);
    }
    function addOnInit(cb) {
      __ATINIT__.unshift(cb);
    }
    function addOnPostRun(cb) {
      __ATPOSTRUN__.unshift(cb);
    }
    var runDependencies = 0;
    var dependenciesFulfilled = null;
    function addRunDependency(id) {
      assert(
        !ENVIRONMENT_IS_PTHREAD,
        "addRunDependency cannot be used in a pthread worker"
      );
      runDependencies++;
      if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies);
      }
    }
    function removeRunDependency(id) {
      runDependencies--;
      if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies);
      }
      if (runDependencies == 0) {
        if (dependenciesFulfilled) {
          var callback = dependenciesFulfilled;
          dependenciesFulfilled = null;
          callback();
        }
      }
    }
    Module["preloadedImages"] = {};
    Module["preloadedAudios"] = {};
    function abort(what) {
      if (Module["onAbort"]) {
        Module["onAbort"](what);
      }
      if (ENVIRONMENT_IS_PTHREAD)
        console.error("Pthread aborting at " + new Error().stack);
      what += "";
      err(what);
      ABORT = true;
      what = "abort(" + what + "). Build with -s ASSERTIONS=1 for more info.";
      var e = new WebAssembly.RuntimeError(what);
      readyPromiseReject(e);
      throw e;
    }
    var dataURIPrefix = "data:application/octet-stream;base64,";
    function isDataURI(filename) {
      return filename.startsWith(dataURIPrefix);
    }
    if (Module["locateFile"]) {
      var wasmBinaryFile = "avif_node_enc_mt.wasm";
      if (!isDataURI(wasmBinaryFile)) {
        wasmBinaryFile = locateFile(wasmBinaryFile);
      }
    } else {
      var wasmBinaryFile = new URL(
        "avif_node_enc_mt.wasm",
        typeof document === "undefined"
          ? new (require("u" + "rl").URL)("file:" + __filename).href
          : (document.currentScript && document.currentScript.src) ||
            new URL("avif_node_enc_mt-143090b9.js", document.baseURI).href
      ).toString();
    }
    function getBinary(file) {
      try {
        if (file == wasmBinaryFile && wasmBinary) {
          return new Uint8Array(wasmBinary);
        }
        if (readBinary) {
          return readBinary(file);
        } else {
          throw "both async and sync fetching of the wasm failed";
        }
      } catch (err) {
        abort(err);
      }
    }
    function getBinaryPromise() {
      if (!wasmBinary && ENVIRONMENT_IS_WORKER) {
        if (typeof fetch === "function") {
          return fetch(wasmBinaryFile, { credentials: "same-origin" })
            .then(function (response) {
              if (!response["ok"]) {
                throw (
                  "failed to load wasm binary file at '" + wasmBinaryFile + "'"
                );
              }
              return response["arrayBuffer"]();
            })
            .catch(function () {
              return getBinary(wasmBinaryFile);
            });
        }
      }
      return Promise.resolve().then(function () {
        return getBinary(wasmBinaryFile);
      });
    }
    function createWasm() {
      var info = { a: asmLibraryArg };
      function receiveInstance(instance, module) {
        var exports = instance.exports;
        Module["asm"] = exports;
        wasmTable = Module["asm"]["ja"];
        addOnInit(Module["asm"]["fa"]);
        PThread.tlsInitFunctions.push(Module["asm"]["ia"]);
        wasmModule = module;
        if (!ENVIRONMENT_IS_PTHREAD) {
          var numWorkersToLoad = PThread.unusedWorkers.length;
          PThread.unusedWorkers.forEach(function (w) {
            PThread.loadWasmModuleToWorker(w, function () {
              if (!--numWorkersToLoad) removeRunDependency();
            });
          });
        }
      }
      if (!ENVIRONMENT_IS_PTHREAD) {
        addRunDependency();
      }
      function receiveInstantiationResult(result) {
        receiveInstance(result["instance"], result["module"]);
      }
      function instantiateArrayBuffer(receiver) {
        return getBinaryPromise()
          .then(function (binary) {
            var result = WebAssembly.instantiate(binary, info);
            return result;
          })
          .then(receiver, function (reason) {
            err("failed to asynchronously prepare wasm: " + reason);
            abort(reason);
          });
      }
      function instantiateAsync() {
        if (
          !wasmBinary &&
          typeof WebAssembly.instantiateStreaming === "function" &&
          !isDataURI(wasmBinaryFile) &&
          typeof fetch === "function"
        ) {
          return fetch(wasmBinaryFile, { credentials: "same-origin" }).then(
            function (response) {
              var result = WebAssembly.instantiateStreaming(response, info);
              return result.then(receiveInstantiationResult, function (reason) {
                err("wasm streaming compile failed: " + reason);
                err("falling back to ArrayBuffer instantiation");
                return instantiateArrayBuffer(receiveInstantiationResult);
              });
            }
          );
        } else {
          return instantiateArrayBuffer(receiveInstantiationResult);
        }
      }
      if (Module["instantiateWasm"]) {
        try {
          var exports = Module["instantiateWasm"](info, receiveInstance);
          return exports;
        } catch (e) {
          err("Module.instantiateWasm callback failed with error: " + e);
          return false;
        }
      }
      instantiateAsync().catch(readyPromiseReject);
      return {};
    }
    var ASM_CONSTS = {
      601124: function () {
        throw "Canceled!";
      },
      601142: function ($0, $1) {
        setTimeout(function () {
          __emscripten_do_dispatch_to_thread($0, $1);
        }, 0);
      },
    };
    function initPthreadsJS() {
      PThread.initRuntime();
    }
    function callRuntimeCallbacks(callbacks) {
      while (callbacks.length > 0) {
        var callback = callbacks.shift();
        if (typeof callback == "function") {
          callback(Module);
          continue;
        }
        var func = callback.func;
        if (typeof func === "number") {
          if (callback.arg === undefined) {
            wasmTable.get(func)();
          } else {
            wasmTable.get(func)(callback.arg);
          }
        } else {
          func(callback.arg === undefined ? null : callback.arg);
        }
      }
    }
    var ERRNO_CODES = {
      EPERM: 63,
      ENOENT: 44,
      ESRCH: 71,
      EINTR: 27,
      EIO: 29,
      ENXIO: 60,
      E2BIG: 1,
      ENOEXEC: 45,
      EBADF: 8,
      ECHILD: 12,
      EAGAIN: 6,
      EWOULDBLOCK: 6,
      ENOMEM: 48,
      EACCES: 2,
      EFAULT: 21,
      ENOTBLK: 105,
      EBUSY: 10,
      EEXIST: 20,
      EXDEV: 75,
      ENODEV: 43,
      ENOTDIR: 54,
      EISDIR: 31,
      EINVAL: 28,
      ENFILE: 41,
      EMFILE: 33,
      ENOTTY: 59,
      ETXTBSY: 74,
      EFBIG: 22,
      ENOSPC: 51,
      ESPIPE: 70,
      EROFS: 69,
      EMLINK: 34,
      EPIPE: 64,
      EDOM: 18,
      ERANGE: 68,
      ENOMSG: 49,
      EIDRM: 24,
      ECHRNG: 106,
      EL2NSYNC: 156,
      EL3HLT: 107,
      EL3RST: 108,
      ELNRNG: 109,
      EUNATCH: 110,
      ENOCSI: 111,
      EL2HLT: 112,
      EDEADLK: 16,
      ENOLCK: 46,
      EBADE: 113,
      EBADR: 114,
      EXFULL: 115,
      ENOANO: 104,
      EBADRQC: 103,
      EBADSLT: 102,
      EDEADLOCK: 16,
      EBFONT: 101,
      ENOSTR: 100,
      ENODATA: 116,
      ETIME: 117,
      ENOSR: 118,
      ENONET: 119,
      ENOPKG: 120,
      EREMOTE: 121,
      ENOLINK: 47,
      EADV: 122,
      ESRMNT: 123,
      ECOMM: 124,
      EPROTO: 65,
      EMULTIHOP: 36,
      EDOTDOT: 125,
      EBADMSG: 9,
      ENOTUNIQ: 126,
      EBADFD: 127,
      EREMCHG: 128,
      ELIBACC: 129,
      ELIBBAD: 130,
      ELIBSCN: 131,
      ELIBMAX: 132,
      ELIBEXEC: 133,
      ENOSYS: 52,
      ENOTEMPTY: 55,
      ENAMETOOLONG: 37,
      ELOOP: 32,
      EOPNOTSUPP: 138,
      EPFNOSUPPORT: 139,
      ECONNRESET: 15,
      ENOBUFS: 42,
      EAFNOSUPPORT: 5,
      EPROTOTYPE: 67,
      ENOTSOCK: 57,
      ENOPROTOOPT: 50,
      ESHUTDOWN: 140,
      ECONNREFUSED: 14,
      EADDRINUSE: 3,
      ECONNABORTED: 13,
      ENETUNREACH: 40,
      ENETDOWN: 38,
      ETIMEDOUT: 73,
      EHOSTDOWN: 142,
      EHOSTUNREACH: 23,
      EINPROGRESS: 26,
      EALREADY: 7,
      EDESTADDRREQ: 17,
      EMSGSIZE: 35,
      EPROTONOSUPPORT: 66,
      ESOCKTNOSUPPORT: 137,
      EADDRNOTAVAIL: 4,
      ENETRESET: 39,
      EISCONN: 30,
      ENOTCONN: 53,
      ETOOMANYREFS: 141,
      EUSERS: 136,
      EDQUOT: 19,
      ESTALE: 72,
      ENOTSUP: 138,
      ENOMEDIUM: 148,
      EILSEQ: 25,
      EOVERFLOW: 61,
      ECANCELED: 11,
      ENOTRECOVERABLE: 56,
      EOWNERDEAD: 62,
      ESTRPIPE: 135,
    };
    function _emscripten_futex_wake(addr, count) {
      if (
        addr <= 0 ||
        addr > GROWABLE_HEAP_I8().length ||
        addr & (3 != 0) ||
        count < 0
      )
        return -28;
      if (count == 0) return 0;
      if (count >= 2147483647) count = Infinity;
      var mainThreadWaitAddress = Atomics.load(
        GROWABLE_HEAP_I32(),
        __emscripten_main_thread_futex >> 2
      );
      var mainThreadWoken = 0;
      if (mainThreadWaitAddress == addr) {
        var loadedAddr = Atomics.compareExchange(
          GROWABLE_HEAP_I32(),
          __emscripten_main_thread_futex >> 2,
          mainThreadWaitAddress,
          0
        );
        if (loadedAddr == mainThreadWaitAddress) {
          --count;
          mainThreadWoken = 1;
          if (count <= 0) return 1;
        }
      }
      var ret = Atomics.notify(GROWABLE_HEAP_I32(), addr >> 2, count);
      if (ret >= 0) return ret + mainThreadWoken;
      throw "Atomics.notify returned an unexpected value " + ret;
    }
    Module["_emscripten_futex_wake"] = _emscripten_futex_wake;
    function killThread(pthread_ptr) {
      if (ENVIRONMENT_IS_PTHREAD)
        throw "Internal Error! killThread() can only ever be called from main application thread!";
      if (!pthread_ptr) throw "Internal Error! Null pthread_ptr in killThread!";
      GROWABLE_HEAP_I32()[(pthread_ptr + 12) >> 2] = 0;
      var pthread = PThread.pthreads[pthread_ptr];
      pthread.worker.terminate();
      PThread.freeThreadData(pthread);
      PThread.runningWorkers.splice(
        PThread.runningWorkers.indexOf(pthread.worker),
        1
      );
      pthread.worker.pthread = undefined;
    }
    function cancelThread(pthread_ptr) {
      if (ENVIRONMENT_IS_PTHREAD)
        throw "Internal Error! cancelThread() can only ever be called from main application thread!";
      if (!pthread_ptr)
        throw "Internal Error! Null pthread_ptr in cancelThread!";
      var pthread = PThread.pthreads[pthread_ptr];
      pthread.worker.postMessage({ cmd: "cancel" });
    }
    function cleanupThread(pthread_ptr) {
      if (ENVIRONMENT_IS_PTHREAD)
        throw "Internal Error! cleanupThread() can only ever be called from main application thread!";
      if (!pthread_ptr)
        throw "Internal Error! Null pthread_ptr in cleanupThread!";
      var pthread = PThread.pthreads[pthread_ptr];
      if (pthread) {
        GROWABLE_HEAP_I32()[(pthread_ptr + 12) >> 2] = 0;
        var worker = pthread.worker;
        PThread.returnWorkerToPool(worker);
      }
    }
    var PThread = {
      unusedWorkers: [],
      runningWorkers: [],
      tlsInitFunctions: [],
      initMainThreadBlock: function () {
        var pthreadPoolSize = navigator.hardwareConcurrency;
        for (var i = 0; i < pthreadPoolSize; ++i) {
          PThread.allocateUnusedWorker();
        }
      },
      initRuntime: function () {
        var tb = _malloc(228);
        for (var i = 0; i < 228 / 4; ++i) GROWABLE_HEAP_U32()[tb / 4 + i] = 0;
        GROWABLE_HEAP_I32()[(tb + 12) >> 2] = tb;
        var headPtr = tb + 152;
        GROWABLE_HEAP_I32()[headPtr >> 2] = headPtr;
        var tlsMemory = _malloc(512);
        for (var i = 0; i < 128; ++i)
          GROWABLE_HEAP_U32()[tlsMemory / 4 + i] = 0;
        Atomics.store(GROWABLE_HEAP_U32(), (tb + 100) >> 2, tlsMemory);
        Atomics.store(GROWABLE_HEAP_U32(), (tb + 40) >> 2, tb);
        __emscripten_thread_init(tb, !ENVIRONMENT_IS_WORKER, 1);
        _emscripten_register_main_browser_thread_id(tb);
      },
      initWorker: function () {},
      pthreads: {},
      threadExitHandlers: [],
      runExitHandlers: function () {
        while (PThread.threadExitHandlers.length > 0) {
          PThread.threadExitHandlers.pop()();
        }
        if (ENVIRONMENT_IS_PTHREAD && _pthread_self())
          ___pthread_tsd_run_dtors();
      },
      runExitHandlersAndDeinitThread: function (tb, exitCode) {
        Atomics.store(GROWABLE_HEAP_U32(), (tb + 56) >> 2, 1);
        Atomics.store(GROWABLE_HEAP_U32(), (tb + 60) >> 2, 0);
        PThread.runExitHandlers();
        Atomics.store(GROWABLE_HEAP_U32(), (tb + 4) >> 2, exitCode);
        Atomics.store(GROWABLE_HEAP_U32(), (tb + 0) >> 2, 1);
        _emscripten_futex_wake(tb + 0, 2147483647);
        __emscripten_thread_init(0, 0, 0);
      },
      setExitStatus: function (status) {},
      threadExit: function (exitCode) {
        var tb = _pthread_self();
        if (tb) {
          PThread.runExitHandlersAndDeinitThread(tb, exitCode);
          if (ENVIRONMENT_IS_PTHREAD) {
            postMessage({ cmd: "exit" });
          }
        }
      },
      threadCancel: function () {
        PThread.runExitHandlersAndDeinitThread(_pthread_self(), -1);
        postMessage({ cmd: "cancelDone" });
      },
      terminateAllThreads: function () {
        for (var t in PThread.pthreads) {
          var pthread = PThread.pthreads[t];
          if (pthread && pthread.worker) {
            PThread.returnWorkerToPool(pthread.worker);
          }
        }
        PThread.pthreads = {};
        for (var i = 0; i < PThread.unusedWorkers.length; ++i) {
          var worker = PThread.unusedWorkers[i];
          worker.terminate();
        }
        PThread.unusedWorkers = [];
        for (var i = 0; i < PThread.runningWorkers.length; ++i) {
          var worker = PThread.runningWorkers[i];
          var pthread = worker.pthread;
          PThread.freeThreadData(pthread);
          worker.terminate();
        }
        PThread.runningWorkers = [];
      },
      freeThreadData: function (pthread) {
        if (!pthread) return;
        if (pthread.threadInfoStruct) {
          var tlsMemory =
            GROWABLE_HEAP_I32()[(pthread.threadInfoStruct + 100) >> 2];
          GROWABLE_HEAP_I32()[(pthread.threadInfoStruct + 100) >> 2] = 0;
          _free(tlsMemory);
          _free(pthread.threadInfoStruct);
        }
        pthread.threadInfoStruct = 0;
        if (pthread.allocatedOwnStack && pthread.stackBase)
          _free(pthread.stackBase);
        pthread.stackBase = 0;
        if (pthread.worker) pthread.worker.pthread = null;
      },
      returnWorkerToPool: function (worker) {
        PThread.runWithoutMainThreadQueuedCalls(function () {
          delete PThread.pthreads[worker.pthread.threadInfoStruct];
          PThread.unusedWorkers.push(worker);
          PThread.runningWorkers.splice(
            PThread.runningWorkers.indexOf(worker),
            1
          );
          PThread.freeThreadData(worker.pthread);
          worker.pthread = undefined;
        });
      },
      runWithoutMainThreadQueuedCalls: function (func) {
        GROWABLE_HEAP_I32()[
          __emscripten_allow_main_runtime_queued_calls >> 2
        ] = 0;
        try {
          func();
        } finally {
          GROWABLE_HEAP_I32()[
            __emscripten_allow_main_runtime_queued_calls >> 2
          ] = 1;
        }
      },
      receiveObjectTransfer: function (data) {},
      threadInit: function () {
        for (var i in PThread.tlsInitFunctions) {
          PThread.tlsInitFunctions[i]();
        }
      },
      loadWasmModuleToWorker: function (worker, onFinishedLoading) {
        worker.onmessage = function (e) {
          var d = e["data"];
          var cmd = d["cmd"];
          if (worker.pthread)
            PThread.currentProxiedOperationCallerThread =
              worker.pthread.threadInfoStruct;
          if (d["targetThread"] && d["targetThread"] != _pthread_self()) {
            var thread = PThread.pthreads[d.targetThread];
            if (thread) {
              thread.worker.postMessage(e.data, d["transferList"]);
            } else {
              console.error(
                'Internal error! Worker sent a message "' +
                  cmd +
                  '" to target pthread ' +
                  d["targetThread"] +
                  ", but that thread no longer exists!"
              );
            }
            PThread.currentProxiedOperationCallerThread = undefined;
            return;
          }
          if (cmd === "processQueuedMainThreadWork") {
            _emscripten_main_thread_process_queued_calls();
          } else if (cmd === "spawnThread") {
            spawnThread(e.data);
          } else if (cmd === "cleanupThread") {
            cleanupThread(d["thread"]);
          } else if (cmd === "killThread") {
            killThread(d["thread"]);
          } else if (cmd === "cancelThread") {
            cancelThread(d["thread"]);
          } else if (cmd === "loaded") {
            worker.loaded = true;
            if (onFinishedLoading) onFinishedLoading(worker);
            if (worker.runPthread) {
              worker.runPthread();
              delete worker.runPthread;
            }
          } else if (cmd === "print") {
            out("Thread " + d["threadId"] + ": " + d["text"]);
          } else if (cmd === "printErr") {
            err("Thread " + d["threadId"] + ": " + d["text"]);
          } else if (cmd === "alert") {
            alert("Thread " + d["threadId"] + ": " + d["text"]);
          } else if (cmd === "exit") {
            var detached =
              worker.pthread &&
              Atomics.load(
                GROWABLE_HEAP_U32(),
                (worker.pthread.threadInfoStruct + 64) >> 2
              );
            if (detached) {
              PThread.returnWorkerToPool(worker);
            }
          } else if (cmd === "exitProcess") {
            try {
              exit(d["returnCode"]);
            } catch (e) {
              if (e instanceof ExitStatus) return;
              throw e;
            }
          } else if (cmd === "cancelDone") {
            PThread.returnWorkerToPool(worker);
          } else if (cmd === "objectTransfer") {
            PThread.receiveObjectTransfer(e.data);
          } else if (e.data.target === "setimmediate") {
            worker.postMessage(e.data);
          } else {
            err("worker sent an unknown command " + cmd);
          }
          PThread.currentProxiedOperationCallerThread = undefined;
        };
        worker.onerror = function (e) {
          err(
            "pthread sent an error! " +
              e.filename +
              ":" +
              e.lineno +
              ": " +
              e.message
          );
        };
        {
          worker.on("message", function (data) {
            worker.onmessage({ data: data });
          });
          worker.on("error", function (data) {
            worker.onerror(data);
          });
          worker.on("exit", function (data) {});
        }
        worker.postMessage({
          cmd: "load",
          urlOrBlob: Module["mainScriptUrlOrBlob"],
          wasmMemory: wasmMemory,
          wasmModule: wasmModule,
        });
      },
      allocateUnusedWorker: function () {
        if (!Module["locateFile"]) {
          PThread.unusedWorkers.push(
            new Worker(
              new URL(
                "avif_node_enc_mt.worker.js",
                typeof document === "undefined"
                  ? new (require("u" + "rl").URL)("file:" + __filename).href
                  : (document.currentScript && document.currentScript.src) ||
                    new URL("avif_node_enc_mt-143090b9.js", document.baseURI)
                      .href
              )
            )
          );
          return;
        }
        var pthreadMainJs = locateFile("avif_node_enc_mt.worker.js");
        PThread.unusedWorkers.push(new Worker(pthreadMainJs));
      },
      getNewWorker: function () {
        if (PThread.unusedWorkers.length == 0) {
          PThread.allocateUnusedWorker();
          PThread.loadWasmModuleToWorker(PThread.unusedWorkers[0]);
        }
        return PThread.unusedWorkers.pop();
      },
      busySpinWait: function (msecs) {
        var t = performance.now() + msecs;
        while (performance.now() < t) {}
      },
    };
    function establishStackSpace(stackTop, stackMax) {
      _emscripten_stack_set_limits(stackTop, stackMax);
      stackRestore(stackTop);
    }
    Module["establishStackSpace"] = establishStackSpace;
    function invokeEntryPoint(ptr, arg) {
      return wasmTable.get(ptr)(arg);
    }
    Module["invokeEntryPoint"] = invokeEntryPoint;
    var runtimeKeepaliveCounter = 0;
    function keepRuntimeAlive() {
      return noExitRuntime || runtimeKeepaliveCounter > 0;
    }
    Module["keepRuntimeAlive"] = keepRuntimeAlive;
    function ___assert_fail(condition, filename, line, func) {
      abort(
        "Assertion failed: " +
          UTF8ToString(condition) +
          ", at: " +
          [
            filename ? UTF8ToString(filename) : "unknown filename",
            line,
            func ? UTF8ToString(func) : "unknown function",
          ]
      );
    }
    var _emscripten_get_now;
    {
      _emscripten_get_now = function () {
        var t = process["hrtime"]();
        return t[0] * 1e3 + t[1] / 1e6;
      };
    }
    function _pthread_cleanup_push(routine, arg) {
      PThread.threadExitHandlers.push(function () {
        wasmTable.get(routine)(arg);
      });
    }
    function ___cxa_thread_atexit(a0, a1) {
      return _pthread_cleanup_push(a0, a1);
    }
    var SYSCALLS = {
      mappings: {},
      buffers: [null, [], []],
      printChar: function (stream, curr) {
        var buffer = SYSCALLS.buffers[stream];
        if (curr === 0 || curr === 10) {
          (stream === 1 ? out : err)(UTF8ArrayToString(buffer, 0));
          buffer.length = 0;
        } else {
          buffer.push(curr);
        }
      },
      varargs: undefined,
      get: function () {
        SYSCALLS.varargs += 4;
        var ret = GROWABLE_HEAP_I32()[(SYSCALLS.varargs - 4) >> 2];
        return ret;
      },
      getStr: function (ptr) {
        var ret = UTF8ToString(ptr);
        return ret;
      },
      get64: function (low, high) {
        return low;
      },
    };
    function ___sys_fcntl64(fd, cmd, varargs) {
      if (ENVIRONMENT_IS_PTHREAD)
        return _emscripten_proxy_to_main_thread_js(1, 1, fd, cmd, varargs);
      SYSCALLS.varargs = varargs;
      return 0;
    }
    function ___sys_ioctl(fd, op, varargs) {
      if (ENVIRONMENT_IS_PTHREAD)
        return _emscripten_proxy_to_main_thread_js(2, 1, fd, op, varargs);
      SYSCALLS.varargs = varargs;
      return 0;
    }
    function ___sys_open(path, flags, varargs) {
      if (ENVIRONMENT_IS_PTHREAD)
        return _emscripten_proxy_to_main_thread_js(3, 1, path, flags, varargs);
      SYSCALLS.varargs = varargs;
    }
    var structRegistrations = {};
    function runDestructors(destructors) {
      while (destructors.length) {
        var ptr = destructors.pop();
        var del = destructors.pop();
        del(ptr);
      }
    }
    function simpleReadValueFromPointer(pointer) {
      return this["fromWireType"](GROWABLE_HEAP_U32()[pointer >> 2]);
    }
    var awaitingDependencies = {};
    var registeredTypes = {};
    var typeDependencies = {};
    var char_0 = 48;
    var char_9 = 57;
    function makeLegalFunctionName(name) {
      if (undefined === name) {
        return "_unknown";
      }
      name = name.replace(/[^a-zA-Z0-9_]/g, "$");
      var f = name.charCodeAt(0);
      if (f >= char_0 && f <= char_9) {
        return "_" + name;
      } else {
        return name;
      }
    }
    function createNamedFunction(name, body) {
      name = makeLegalFunctionName(name);
      return new Function(
        "body",
        "return function " +
          name +
          "() {\n" +
          '    "use strict";' +
          "    return body.apply(this, arguments);\n" +
          "};\n"
      )(body);
    }
    function extendError(baseErrorType, errorName) {
      var errorClass = createNamedFunction(errorName, function (message) {
        this.name = errorName;
        this.message = message;
        var stack = new Error(message).stack;
        if (stack !== undefined) {
          this.stack =
            this.toString() + "\n" + stack.replace(/^Error(:[^\n]*)?\n/, "");
        }
      });
      errorClass.prototype = Object.create(baseErrorType.prototype);
      errorClass.prototype.constructor = errorClass;
      errorClass.prototype.toString = function () {
        if (this.message === undefined) {
          return this.name;
        } else {
          return this.name + ": " + this.message;
        }
      };
      return errorClass;
    }
    var InternalError = undefined;
    function throwInternalError(message) {
      throw new InternalError(message);
    }
    function whenDependentTypesAreResolved(
      myTypes,
      dependentTypes,
      getTypeConverters
    ) {
      myTypes.forEach(function (type) {
        typeDependencies[type] = dependentTypes;
      });
      function onComplete(typeConverters) {
        var myTypeConverters = getTypeConverters(typeConverters);
        if (myTypeConverters.length !== myTypes.length) {
          throwInternalError("Mismatched type converter count");
        }
        for (var i = 0; i < myTypes.length; ++i) {
          registerType(myTypes[i], myTypeConverters[i]);
        }
      }
      var typeConverters = new Array(dependentTypes.length);
      var unregisteredTypes = [];
      var registered = 0;
      dependentTypes.forEach(function (dt, i) {
        if (registeredTypes.hasOwnProperty(dt)) {
          typeConverters[i] = registeredTypes[dt];
        } else {
          unregisteredTypes.push(dt);
          if (!awaitingDependencies.hasOwnProperty(dt)) {
            awaitingDependencies[dt] = [];
          }
          awaitingDependencies[dt].push(function () {
            typeConverters[i] = registeredTypes[dt];
            ++registered;
            if (registered === unregisteredTypes.length) {
              onComplete(typeConverters);
            }
          });
        }
      });
      if (0 === unregisteredTypes.length) {
        onComplete(typeConverters);
      }
    }
    function __embind_finalize_value_object(structType) {
      var reg = structRegistrations[structType];
      delete structRegistrations[structType];
      var rawConstructor = reg.rawConstructor;
      var rawDestructor = reg.rawDestructor;
      var fieldRecords = reg.fields;
      var fieldTypes = fieldRecords
        .map(function (field) {
          return field.getterReturnType;
        })
        .concat(
          fieldRecords.map(function (field) {
            return field.setterArgumentType;
          })
        );
      whenDependentTypesAreResolved(
        [structType],
        fieldTypes,
        function (fieldTypes) {
          var fields = {};
          fieldRecords.forEach(function (field, i) {
            var fieldName = field.fieldName;
            var getterReturnType = fieldTypes[i];
            var getter = field.getter;
            var getterContext = field.getterContext;
            var setterArgumentType = fieldTypes[i + fieldRecords.length];
            var setter = field.setter;
            var setterContext = field.setterContext;
            fields[fieldName] = {
              read: function (ptr) {
                return getterReturnType["fromWireType"](
                  getter(getterContext, ptr)
                );
              },
              write: function (ptr, o) {
                var destructors = [];
                setter(
                  setterContext,
                  ptr,
                  setterArgumentType["toWireType"](destructors, o)
                );
                runDestructors(destructors);
              },
            };
          });
          return [
            {
              name: reg.name,
              fromWireType: function (ptr) {
                var rv = {};
                for (var i in fields) {
                  rv[i] = fields[i].read(ptr);
                }
                rawDestructor(ptr);
                return rv;
              },
              toWireType: function (destructors, o) {
                for (var fieldName in fields) {
                  if (!(fieldName in o)) {
                    throw new TypeError('Missing field:  "' + fieldName + '"');
                  }
                }
                var ptr = rawConstructor();
                for (fieldName in fields) {
                  fields[fieldName].write(ptr, o[fieldName]);
                }
                if (destructors !== null) {
                  destructors.push(rawDestructor, ptr);
                }
                return ptr;
              },
              argPackAdvance: 8,
              readValueFromPointer: simpleReadValueFromPointer,
              destructorFunction: rawDestructor,
            },
          ];
        }
      );
    }
    function __embind_register_bigint(
      primitiveType,
      name,
      size,
      minRange,
      maxRange
    ) {}
    function getShiftFromSize(size) {
      switch (size) {
        case 1:
          return 0;
        case 2:
          return 1;
        case 4:
          return 2;
        case 8:
          return 3;
        default:
          throw new TypeError("Unknown type size: " + size);
      }
    }
    function embind_init_charCodes() {
      var codes = new Array(256);
      for (var i = 0; i < 256; ++i) {
        codes[i] = String.fromCharCode(i);
      }
      embind_charCodes = codes;
    }
    var embind_charCodes = undefined;
    function readLatin1String(ptr) {
      var ret = "";
      var c = ptr;
      while (GROWABLE_HEAP_U8()[c]) {
        ret += embind_charCodes[GROWABLE_HEAP_U8()[c++]];
      }
      return ret;
    }
    var BindingError = undefined;
    function throwBindingError(message) {
      throw new BindingError(message);
    }
    function registerType(rawType, registeredInstance, options) {
      options = options || {};
      if (!("argPackAdvance" in registeredInstance)) {
        throw new TypeError(
          "registerType registeredInstance requires argPackAdvance"
        );
      }
      var name = registeredInstance.name;
      if (!rawType) {
        throwBindingError(
          'type "' + name + '" must have a positive integer typeid pointer'
        );
      }
      if (registeredTypes.hasOwnProperty(rawType)) {
        if (options.ignoreDuplicateRegistrations) {
          return;
        } else {
          throwBindingError("Cannot register type '" + name + "' twice");
        }
      }
      registeredTypes[rawType] = registeredInstance;
      delete typeDependencies[rawType];
      if (awaitingDependencies.hasOwnProperty(rawType)) {
        var callbacks = awaitingDependencies[rawType];
        delete awaitingDependencies[rawType];
        callbacks.forEach(function (cb) {
          cb();
        });
      }
    }
    function __embind_register_bool(
      rawType,
      name,
      size,
      trueValue,
      falseValue
    ) {
      var shift = getShiftFromSize(size);
      name = readLatin1String(name);
      registerType(rawType, {
        name: name,
        fromWireType: function (wt) {
          return !!wt;
        },
        toWireType: function (destructors, o) {
          return o ? trueValue : falseValue;
        },
        argPackAdvance: 8,
        readValueFromPointer: function (pointer) {
          var heap;
          if (size === 1) {
            heap = GROWABLE_HEAP_I8();
          } else if (size === 2) {
            heap = GROWABLE_HEAP_I16();
          } else if (size === 4) {
            heap = GROWABLE_HEAP_I32();
          } else {
            throw new TypeError("Unknown boolean type size: " + name);
          }
          return this["fromWireType"](heap[pointer >> shift]);
        },
        destructorFunction: null,
      });
    }
    var emval_free_list = [];
    var emval_handle_array = [
      {},
      { value: undefined },
      { value: null },
      { value: true },
      { value: false },
    ];
    function __emval_decref(handle) {
      if (handle > 4 && 0 === --emval_handle_array[handle].refcount) {
        emval_handle_array[handle] = undefined;
        emval_free_list.push(handle);
      }
    }
    function count_emval_handles() {
      var count = 0;
      for (var i = 5; i < emval_handle_array.length; ++i) {
        if (emval_handle_array[i] !== undefined) {
          ++count;
        }
      }
      return count;
    }
    function get_first_emval() {
      for (var i = 5; i < emval_handle_array.length; ++i) {
        if (emval_handle_array[i] !== undefined) {
          return emval_handle_array[i];
        }
      }
      return null;
    }
    function init_emval() {
      Module["count_emval_handles"] = count_emval_handles;
      Module["get_first_emval"] = get_first_emval;
    }
    function __emval_register(value) {
      switch (value) {
        case undefined: {
          return 1;
        }
        case null: {
          return 2;
        }
        case true: {
          return 3;
        }
        case false: {
          return 4;
        }
        default: {
          var handle = emval_free_list.length
            ? emval_free_list.pop()
            : emval_handle_array.length;
          emval_handle_array[handle] = { refcount: 1, value: value };
          return handle;
        }
      }
    }
    function __embind_register_emval(rawType, name) {
      name = readLatin1String(name);
      registerType(rawType, {
        name: name,
        fromWireType: function (handle) {
          var rv = emval_handle_array[handle].value;
          __emval_decref(handle);
          return rv;
        },
        toWireType: function (destructors, value) {
          return __emval_register(value);
        },
        argPackAdvance: 8,
        readValueFromPointer: simpleReadValueFromPointer,
        destructorFunction: null,
      });
    }
    function _embind_repr(v) {
      if (v === null) {
        return "null";
      }
      var t = typeof v;
      if (t === "object" || t === "array" || t === "function") {
        return v.toString();
      } else {
        return "" + v;
      }
    }
    function floatReadValueFromPointer(name, shift) {
      switch (shift) {
        case 2:
          return function (pointer) {
            return this["fromWireType"](GROWABLE_HEAP_F32()[pointer >> 2]);
          };
        case 3:
          return function (pointer) {
            return this["fromWireType"](GROWABLE_HEAP_F64()[pointer >> 3]);
          };
        default:
          throw new TypeError("Unknown float type: " + name);
      }
    }
    function __embind_register_float(rawType, name, size) {
      var shift = getShiftFromSize(size);
      name = readLatin1String(name);
      registerType(rawType, {
        name: name,
        fromWireType: function (value) {
          return value;
        },
        toWireType: function (destructors, value) {
          if (typeof value !== "number" && typeof value !== "boolean") {
            throw new TypeError(
              'Cannot convert "' + _embind_repr(value) + '" to ' + this.name
            );
          }
          return value;
        },
        argPackAdvance: 8,
        readValueFromPointer: floatReadValueFromPointer(name, shift),
        destructorFunction: null,
      });
    }
    function new_(constructor, argumentList) {
      if (!(constructor instanceof Function)) {
        throw new TypeError(
          "new_ called with constructor type " +
            typeof constructor +
            " which is not a function"
        );
      }
      var dummy = createNamedFunction(
        constructor.name || "unknownFunctionName",
        function () {}
      );
      dummy.prototype = constructor.prototype;
      var obj = new dummy();
      var r = constructor.apply(obj, argumentList);
      return r instanceof Object ? r : obj;
    }
    function craftInvokerFunction(
      humanName,
      argTypes,
      classType,
      cppInvokerFunc,
      cppTargetFunc
    ) {
      var argCount = argTypes.length;
      if (argCount < 2) {
        throwBindingError(
          "argTypes array size mismatch! Must at least get return value and 'this' types!"
        );
      }
      var isClassMethodFunc = argTypes[1] !== null && classType !== null;
      var needsDestructorStack = false;
      for (var i = 1; i < argTypes.length; ++i) {
        if (
          argTypes[i] !== null &&
          argTypes[i].destructorFunction === undefined
        ) {
          needsDestructorStack = true;
          break;
        }
      }
      var returns = argTypes[0].name !== "void";
      var argsList = "";
      var argsListWired = "";
      for (var i = 0; i < argCount - 2; ++i) {
        argsList += (i !== 0 ? ", " : "") + "arg" + i;
        argsListWired += (i !== 0 ? ", " : "") + "arg" + i + "Wired";
      }
      var invokerFnBody =
        "return function " +
        makeLegalFunctionName(humanName) +
        "(" +
        argsList +
        ") {\n" +
        "if (arguments.length !== " +
        (argCount - 2) +
        ") {\n" +
        "throwBindingError('function " +
        humanName +
        " called with ' + arguments.length + ' arguments, expected " +
        (argCount - 2) +
        " args!');\n" +
        "}\n";
      if (needsDestructorStack) {
        invokerFnBody += "var destructors = [];\n";
      }
      var dtorStack = needsDestructorStack ? "destructors" : "null";
      var args1 = [
        "throwBindingError",
        "invoker",
        "fn",
        "runDestructors",
        "retType",
        "classParam",
      ];
      var args2 = [
        throwBindingError,
        cppInvokerFunc,
        cppTargetFunc,
        runDestructors,
        argTypes[0],
        argTypes[1],
      ];
      if (isClassMethodFunc) {
        invokerFnBody +=
          "var thisWired = classParam.toWireType(" + dtorStack + ", this);\n";
      }
      for (var i = 0; i < argCount - 2; ++i) {
        invokerFnBody +=
          "var arg" +
          i +
          "Wired = argType" +
          i +
          ".toWireType(" +
          dtorStack +
          ", arg" +
          i +
          "); // " +
          argTypes[i + 2].name +
          "\n";
        args1.push("argType" + i);
        args2.push(argTypes[i + 2]);
      }
      if (isClassMethodFunc) {
        argsListWired =
          "thisWired" + (argsListWired.length > 0 ? ", " : "") + argsListWired;
      }
      invokerFnBody +=
        (returns ? "var rv = " : "") +
        "invoker(fn" +
        (argsListWired.length > 0 ? ", " : "") +
        argsListWired +
        ");\n";
      if (needsDestructorStack) {
        invokerFnBody += "runDestructors(destructors);\n";
      } else {
        for (var i = isClassMethodFunc ? 1 : 2; i < argTypes.length; ++i) {
          var paramName = i === 1 ? "thisWired" : "arg" + (i - 2) + "Wired";
          if (argTypes[i].destructorFunction !== null) {
            invokerFnBody +=
              paramName +
              "_dtor(" +
              paramName +
              "); // " +
              argTypes[i].name +
              "\n";
            args1.push(paramName + "_dtor");
            args2.push(argTypes[i].destructorFunction);
          }
        }
      }
      if (returns) {
        invokerFnBody +=
          "var ret = retType.fromWireType(rv);\n" + "return ret;\n";
      }
      invokerFnBody += "}\n";
      args1.push(invokerFnBody);
      var invokerFunction = new_(Function, args1).apply(null, args2);
      return invokerFunction;
    }
    function ensureOverloadTable(proto, methodName, humanName) {
      if (undefined === proto[methodName].overloadTable) {
        var prevFunc = proto[methodName];
        proto[methodName] = function () {
          if (
            !proto[methodName].overloadTable.hasOwnProperty(arguments.length)
          ) {
            throwBindingError(
              "Function '" +
                humanName +
                "' called with an invalid number of arguments (" +
                arguments.length +
                ") - expects one of (" +
                proto[methodName].overloadTable +
                ")!"
            );
          }
          return proto[methodName].overloadTable[arguments.length].apply(
            this,
            arguments
          );
        };
        proto[methodName].overloadTable = [];
        proto[methodName].overloadTable[prevFunc.argCount] = prevFunc;
      }
    }
    function exposePublicSymbol(name, value, numArguments) {
      if (Module.hasOwnProperty(name)) {
        if (
          undefined === numArguments ||
          (undefined !== Module[name].overloadTable &&
            undefined !== Module[name].overloadTable[numArguments])
        ) {
          throwBindingError("Cannot register public name '" + name + "' twice");
        }
        ensureOverloadTable(Module, name, name);
        if (Module.hasOwnProperty(numArguments)) {
          throwBindingError(
            "Cannot register multiple overloads of a function with the same number of arguments (" +
              numArguments +
              ")!"
          );
        }
        Module[name].overloadTable[numArguments] = value;
      } else {
        Module[name] = value;
        if (undefined !== numArguments) {
          Module[name].numArguments = numArguments;
        }
      }
    }
    function heap32VectorToArray(count, firstElement) {
      var array = [];
      for (var i = 0; i < count; i++) {
        array.push(GROWABLE_HEAP_I32()[(firstElement >> 2) + i]);
      }
      return array;
    }
    function replacePublicSymbol(name, value, numArguments) {
      if (!Module.hasOwnProperty(name)) {
        throwInternalError("Replacing nonexistant public symbol");
      }
      if (
        undefined !== Module[name].overloadTable &&
        undefined !== numArguments
      ) {
        Module[name].overloadTable[numArguments] = value;
      } else {
        Module[name] = value;
        Module[name].argCount = numArguments;
      }
    }
    function dynCallLegacy(sig, ptr, args) {
      var f = Module["dynCall_" + sig];
      return args && args.length
        ? f.apply(null, [ptr].concat(args))
        : f.call(null, ptr);
    }
    function dynCall(sig, ptr, args) {
      if (sig.includes("j")) {
        return dynCallLegacy(sig, ptr, args);
      }
      return wasmTable.get(ptr).apply(null, args);
    }
    function getDynCaller(sig, ptr) {
      var argCache = [];
      return function () {
        argCache.length = arguments.length;
        for (var i = 0; i < arguments.length; i++) {
          argCache[i] = arguments[i];
        }
        return dynCall(sig, ptr, argCache);
      };
    }
    function embind__requireFunction(signature, rawFunction) {
      signature = readLatin1String(signature);
      function makeDynCaller() {
        if (signature.includes("j")) {
          return getDynCaller(signature, rawFunction);
        }
        return wasmTable.get(rawFunction);
      }
      var fp = makeDynCaller();
      if (typeof fp !== "function") {
        throwBindingError(
          "unknown function pointer with signature " +
            signature +
            ": " +
            rawFunction
        );
      }
      return fp;
    }
    var UnboundTypeError = undefined;
    function getTypeName(type) {
      var ptr = ___getTypeName(type);
      var rv = readLatin1String(ptr);
      _free(ptr);
      return rv;
    }
    function throwUnboundTypeError(message, types) {
      var unboundTypes = [];
      var seen = {};
      function visit(type) {
        if (seen[type]) {
          return;
        }
        if (registeredTypes[type]) {
          return;
        }
        if (typeDependencies[type]) {
          typeDependencies[type].forEach(visit);
          return;
        }
        unboundTypes.push(type);
        seen[type] = true;
      }
      types.forEach(visit);
      throw new UnboundTypeError(
        message + ": " + unboundTypes.map(getTypeName).join([", "])
      );
    }
    function __embind_register_function(
      name,
      argCount,
      rawArgTypesAddr,
      signature,
      rawInvoker,
      fn
    ) {
      var argTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
      name = readLatin1String(name);
      rawInvoker = embind__requireFunction(signature, rawInvoker);
      exposePublicSymbol(
        name,
        function () {
          throwUnboundTypeError(
            "Cannot call " + name + " due to unbound types",
            argTypes
          );
        },
        argCount - 1
      );
      whenDependentTypesAreResolved([], argTypes, function (argTypes) {
        var invokerArgsArray = [argTypes[0], null].concat(argTypes.slice(1));
        replacePublicSymbol(
          name,
          craftInvokerFunction(name, invokerArgsArray, null, rawInvoker, fn),
          argCount - 1
        );
        return [];
      });
    }
    function integerReadValueFromPointer(name, shift, signed) {
      switch (shift) {
        case 0:
          return signed
            ? function readS8FromPointer(pointer) {
                return GROWABLE_HEAP_I8()[pointer];
              }
            : function readU8FromPointer(pointer) {
                return GROWABLE_HEAP_U8()[pointer];
              };
        case 1:
          return signed
            ? function readS16FromPointer(pointer) {
                return GROWABLE_HEAP_I16()[pointer >> 1];
              }
            : function readU16FromPointer(pointer) {
                return GROWABLE_HEAP_U16()[pointer >> 1];
              };
        case 2:
          return signed
            ? function readS32FromPointer(pointer) {
                return GROWABLE_HEAP_I32()[pointer >> 2];
              }
            : function readU32FromPointer(pointer) {
                return GROWABLE_HEAP_U32()[pointer >> 2];
              };
        default:
          throw new TypeError("Unknown integer type: " + name);
      }
    }
    function __embind_register_integer(
      primitiveType,
      name,
      size,
      minRange,
      maxRange
    ) {
      name = readLatin1String(name);
      if (maxRange === -1) {
        maxRange = 4294967295;
      }
      var shift = getShiftFromSize(size);
      var fromWireType = function (value) {
        return value;
      };
      if (minRange === 0) {
        var bitshift = 32 - 8 * size;
        fromWireType = function (value) {
          return (value << bitshift) >>> bitshift;
        };
      }
      var isUnsignedType = name.includes("unsigned");
      registerType(primitiveType, {
        name: name,
        fromWireType: fromWireType,
        toWireType: function (destructors, value) {
          if (typeof value !== "number" && typeof value !== "boolean") {
            throw new TypeError(
              'Cannot convert "' + _embind_repr(value) + '" to ' + this.name
            );
          }
          if (value < minRange || value > maxRange) {
            throw new TypeError(
              'Passing a number "' +
                _embind_repr(value) +
                '" from JS side to C/C++ side to an argument of type "' +
                name +
                '", which is outside the valid range [' +
                minRange +
                ", " +
                maxRange +
                "]!"
            );
          }
          return isUnsignedType ? value >>> 0 : value | 0;
        },
        argPackAdvance: 8,
        readValueFromPointer: integerReadValueFromPointer(
          name,
          shift,
          minRange !== 0
        ),
        destructorFunction: null,
      });
    }
    function __embind_register_memory_view(rawType, dataTypeIndex, name) {
      var typeMapping = [
        Int8Array,
        Uint8Array,
        Int16Array,
        Uint16Array,
        Int32Array,
        Uint32Array,
        Float32Array,
        Float64Array,
      ];
      var TA = typeMapping[dataTypeIndex];
      function decodeMemoryView(handle) {
        handle = handle >> 2;
        var heap = GROWABLE_HEAP_U32();
        var size = heap[handle];
        var data = heap[handle + 1];
        return new TA(buffer, data, size);
      }
      name = readLatin1String(name);
      registerType(
        rawType,
        {
          name: name,
          fromWireType: decodeMemoryView,
          argPackAdvance: 8,
          readValueFromPointer: decodeMemoryView,
        },
        { ignoreDuplicateRegistrations: true }
      );
    }
    function __embind_register_std_string(rawType, name) {
      name = readLatin1String(name);
      var stdStringIsUTF8 = name === "std::string";
      registerType(rawType, {
        name: name,
        fromWireType: function (value) {
          var length = GROWABLE_HEAP_U32()[value >> 2];
          var str;
          if (stdStringIsUTF8) {
            var decodeStartPtr = value + 4;
            for (var i = 0; i <= length; ++i) {
              var currentBytePtr = value + 4 + i;
              if (i == length || GROWABLE_HEAP_U8()[currentBytePtr] == 0) {
                var maxRead = currentBytePtr - decodeStartPtr;
                var stringSegment = UTF8ToString(decodeStartPtr, maxRead);
                if (str === undefined) {
                  str = stringSegment;
                } else {
                  str += String.fromCharCode(0);
                  str += stringSegment;
                }
                decodeStartPtr = currentBytePtr + 1;
              }
            }
          } else {
            var a = new Array(length);
            for (var i = 0; i < length; ++i) {
              a[i] = String.fromCharCode(GROWABLE_HEAP_U8()[value + 4 + i]);
            }
            str = a.join("");
          }
          _free(value);
          return str;
        },
        toWireType: function (destructors, value) {
          if (value instanceof ArrayBuffer) {
            value = new Uint8Array(value);
          }
          var getLength;
          var valueIsOfTypeString = typeof value === "string";
          if (
            !(
              valueIsOfTypeString ||
              value instanceof Uint8Array ||
              value instanceof Uint8ClampedArray ||
              value instanceof Int8Array
            )
          ) {
            throwBindingError("Cannot pass non-string to std::string");
          }
          if (stdStringIsUTF8 && valueIsOfTypeString) {
            getLength = function () {
              return lengthBytesUTF8(value);
            };
          } else {
            getLength = function () {
              return value.length;
            };
          }
          var length = getLength();
          var ptr = _malloc(4 + length + 1);
          GROWABLE_HEAP_U32()[ptr >> 2] = length;
          if (stdStringIsUTF8 && valueIsOfTypeString) {
            stringToUTF8(value, ptr + 4, length + 1);
          } else {
            if (valueIsOfTypeString) {
              for (var i = 0; i < length; ++i) {
                var charCode = value.charCodeAt(i);
                if (charCode > 255) {
                  _free(ptr);
                  throwBindingError(
                    "String has UTF-16 code units that do not fit in 8 bits"
                  );
                }
                GROWABLE_HEAP_U8()[ptr + 4 + i] = charCode;
              }
            } else {
              for (var i = 0; i < length; ++i) {
                GROWABLE_HEAP_U8()[ptr + 4 + i] = value[i];
              }
            }
          }
          if (destructors !== null) {
            destructors.push(_free, ptr);
          }
          return ptr;
        },
        argPackAdvance: 8,
        readValueFromPointer: simpleReadValueFromPointer,
        destructorFunction: function (ptr) {
          _free(ptr);
        },
      });
    }
    function __embind_register_std_wstring(rawType, charSize, name) {
      name = readLatin1String(name);
      var decodeString, encodeString, getHeap, lengthBytesUTF, shift;
      if (charSize === 2) {
        decodeString = UTF16ToString;
        encodeString = stringToUTF16;
        lengthBytesUTF = lengthBytesUTF16;
        getHeap = function () {
          return GROWABLE_HEAP_U16();
        };
        shift = 1;
      } else if (charSize === 4) {
        decodeString = UTF32ToString;
        encodeString = stringToUTF32;
        lengthBytesUTF = lengthBytesUTF32;
        getHeap = function () {
          return GROWABLE_HEAP_U32();
        };
        shift = 2;
      }
      registerType(rawType, {
        name: name,
        fromWireType: function (value) {
          var length = GROWABLE_HEAP_U32()[value >> 2];
          var HEAP = getHeap();
          var str;
          var decodeStartPtr = value + 4;
          for (var i = 0; i <= length; ++i) {
            var currentBytePtr = value + 4 + i * charSize;
            if (i == length || HEAP[currentBytePtr >> shift] == 0) {
              var maxReadBytes = currentBytePtr - decodeStartPtr;
              var stringSegment = decodeString(decodeStartPtr, maxReadBytes);
              if (str === undefined) {
                str = stringSegment;
              } else {
                str += String.fromCharCode(0);
                str += stringSegment;
              }
              decodeStartPtr = currentBytePtr + charSize;
            }
          }
          _free(value);
          return str;
        },
        toWireType: function (destructors, value) {
          if (!(typeof value === "string")) {
            throwBindingError(
              "Cannot pass non-string to C++ string type " + name
            );
          }
          var length = lengthBytesUTF(value);
          var ptr = _malloc(4 + length + charSize);
          GROWABLE_HEAP_U32()[ptr >> 2] = length >> shift;
          encodeString(value, ptr + 4, length + charSize);
          if (destructors !== null) {
            destructors.push(_free, ptr);
          }
          return ptr;
        },
        argPackAdvance: 8,
        readValueFromPointer: simpleReadValueFromPointer,
        destructorFunction: function (ptr) {
          _free(ptr);
        },
      });
    }
    function __embind_register_value_object(
      rawType,
      name,
      constructorSignature,
      rawConstructor,
      destructorSignature,
      rawDestructor
    ) {
      structRegistrations[rawType] = {
        name: readLatin1String(name),
        rawConstructor: embind__requireFunction(
          constructorSignature,
          rawConstructor
        ),
        rawDestructor: embind__requireFunction(
          destructorSignature,
          rawDestructor
        ),
        fields: [],
      };
    }
    function __embind_register_value_object_field(
      structType,
      fieldName,
      getterReturnType,
      getterSignature,
      getter,
      getterContext,
      setterArgumentType,
      setterSignature,
      setter,
      setterContext
    ) {
      structRegistrations[structType].fields.push({
        fieldName: readLatin1String(fieldName),
        getterReturnType: getterReturnType,
        getter: embind__requireFunction(getterSignature, getter),
        getterContext: getterContext,
        setterArgumentType: setterArgumentType,
        setter: embind__requireFunction(setterSignature, setter),
        setterContext: setterContext,
      });
    }
    function __embind_register_void(rawType, name) {
      name = readLatin1String(name);
      registerType(rawType, {
        isVoid: true,
        name: name,
        argPackAdvance: 0,
        fromWireType: function () {
          return undefined;
        },
        toWireType: function (destructors, o) {
          return undefined;
        },
      });
    }
    function __emscripten_notify_thread_queue(targetThreadId, mainThreadId) {
      if (targetThreadId == mainThreadId) {
        postMessage({ cmd: "processQueuedMainThreadWork" });
      } else if (ENVIRONMENT_IS_PTHREAD) {
        postMessage({
          targetThread: targetThreadId,
          cmd: "processThreadQueue",
        });
      } else {
        var pthread = PThread.pthreads[targetThreadId];
        var worker = pthread && pthread.worker;
        if (!worker) {
          return;
        }
        worker.postMessage({ cmd: "processThreadQueue" });
      }
      return 1;
    }
    var emval_symbols = {};
    function getStringOrSymbol(address) {
      var symbol = emval_symbols[address];
      if (symbol === undefined) {
        return readLatin1String(address);
      } else {
        return symbol;
      }
    }
    function emval_get_global() {
      if (typeof globalThis === "object") {
        return globalThis;
      }
      return (function () {
        return Function;
      })()("return this")();
    }
    function __emval_get_global(name) {
      if (name === 0) {
        return __emval_register(emval_get_global());
      } else {
        name = getStringOrSymbol(name);
        return __emval_register(emval_get_global()[name]);
      }
    }
    function __emval_incref(handle) {
      if (handle > 4) {
        emval_handle_array[handle].refcount += 1;
      }
    }
    function requireRegisteredType(rawType, humanName) {
      var impl = registeredTypes[rawType];
      if (undefined === impl) {
        throwBindingError(
          humanName + " has unknown type " + getTypeName(rawType)
        );
      }
      return impl;
    }
    function craftEmvalAllocator(argCount) {
      var argsList = "";
      for (var i = 0; i < argCount; ++i) {
        argsList += (i !== 0 ? ", " : "") + "arg" + i;
      }
      var functionBody =
        "return function emval_allocator_" +
        argCount +
        "(constructor, argTypes, args) {\n";
      for (var i = 0; i < argCount; ++i) {
        functionBody +=
          "var argType" +
          i +
          " = requireRegisteredType(Module['HEAP32'][(argTypes >>> 2) + " +
          i +
          '], "parameter ' +
          i +
          '");\n' +
          "var arg" +
          i +
          " = argType" +
          i +
          ".readValueFromPointer(args);\n" +
          "args += argType" +
          i +
          "['argPackAdvance'];\n";
      }
      functionBody +=
        "var obj = new constructor(" +
        argsList +
        ");\n" +
        "return __emval_register(obj);\n" +
        "}\n";
      return new Function(
        "requireRegisteredType",
        "Module",
        "__emval_register",
        functionBody
      )(requireRegisteredType, Module, __emval_register);
    }
    var emval_newers = {};
    function requireHandle(handle) {
      if (!handle) {
        throwBindingError("Cannot use deleted val. handle = " + handle);
      }
      return emval_handle_array[handle].value;
    }
    function __emval_new(handle, argCount, argTypes, args) {
      handle = requireHandle(handle);
      var newer = emval_newers[argCount];
      if (!newer) {
        newer = craftEmvalAllocator(argCount);
        emval_newers[argCount] = newer;
      }
      return newer(handle, argTypes, args);
    }
    function _abort() {
      abort();
    }
    var readAsmConstArgsArray = [];
    function readAsmConstArgs(sigPtr, buf) {
      readAsmConstArgsArray.length = 0;
      var ch;
      buf >>= 2;
      while ((ch = GROWABLE_HEAP_U8()[sigPtr++])) {
        var double = ch < 105;
        if (double && buf & 1) buf++;
        readAsmConstArgsArray.push(
          double ? GROWABLE_HEAP_F64()[buf++ >> 1] : GROWABLE_HEAP_I32()[buf]
        );
        ++buf;
      }
      return readAsmConstArgsArray;
    }
    function _emscripten_asm_const_int(code, sigPtr, argbuf) {
      var args = readAsmConstArgs(sigPtr, argbuf);
      return ASM_CONSTS[code].apply(null, args);
    }
    function _emscripten_check_blocking_allowed() {
      return;
    }
    function _emscripten_conditional_set_current_thread_status(
      expectedStatus,
      newStatus
    ) {}
    function _emscripten_futex_wait(addr, val, timeout) {
      if (addr <= 0 || addr > GROWABLE_HEAP_I8().length || addr & (3 != 0))
        return -28;
      {
        var ret = Atomics.wait(GROWABLE_HEAP_I32(), addr >> 2, val, timeout);
        if (ret === "timed-out") return -73;
        if (ret === "not-equal") return -6;
        if (ret === "ok") return 0;
        throw "Atomics.wait returned an unexpected value " + ret;
      }
    }
    function _longjmp(env, value) {
      _setThrew(env, value || 1);
      throw "longjmp";
    }
    function _emscripten_longjmp(a0, a1) {
      return _longjmp(a0, a1);
    }
    function _emscripten_memcpy_big(dest, src, num) {
      GROWABLE_HEAP_U8().copyWithin(dest, src, src + num);
    }
    function _emscripten_num_logical_cores() {
      return require("os").cpus().length;
    }
    function _emscripten_proxy_to_main_thread_js(index, sync) {
      var numCallArgs = arguments.length - 2;
      var stack = stackSave();
      var serializedNumCallArgs = numCallArgs;
      var args = stackAlloc(serializedNumCallArgs * 8);
      var b = args >> 3;
      for (var i = 0; i < numCallArgs; i++) {
        var arg = arguments[2 + i];
        GROWABLE_HEAP_F64()[b + i] = arg;
      }
      var ret = _emscripten_run_in_main_runtime_thread_js(
        index,
        serializedNumCallArgs,
        args,
        sync
      );
      stackRestore(stack);
      return ret;
    }
    var _emscripten_receive_on_main_thread_js_callArgs = [];
    function _emscripten_receive_on_main_thread_js(index, numCallArgs, args) {
      _emscripten_receive_on_main_thread_js_callArgs.length = numCallArgs;
      var b = args >> 3;
      for (var i = 0; i < numCallArgs; i++) {
        _emscripten_receive_on_main_thread_js_callArgs[i] =
          GROWABLE_HEAP_F64()[b + i];
      }
      var isEmAsmConst = index < 0;
      var func = !isEmAsmConst
        ? proxiedFunctionTable[index]
        : ASM_CONSTS[-index - 1];
      return func.apply(null, _emscripten_receive_on_main_thread_js_callArgs);
    }
    function emscripten_realloc_buffer(size) {
      try {
        wasmMemory.grow((size - buffer.byteLength + 65535) >>> 16);
        updateGlobalBufferAndViews(wasmMemory.buffer);
        return 1;
      } catch (e) {}
    }
    function _emscripten_resize_heap(requestedSize) {
      var oldSize = GROWABLE_HEAP_U8().length;
      requestedSize = requestedSize >>> 0;
      if (requestedSize <= oldSize) {
        return false;
      }
      var maxHeapSize = 2147483648;
      if (requestedSize > maxHeapSize) {
        return false;
      }
      for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
        var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
        overGrownHeapSize = Math.min(
          overGrownHeapSize,
          requestedSize + 100663296
        );
        var newSize = Math.min(
          maxHeapSize,
          alignUp(Math.max(requestedSize, overGrownHeapSize), 65536)
        );
        var replacement = emscripten_realloc_buffer(newSize);
        if (replacement) {
          return true;
        }
      }
      return false;
    }
    var JSEvents = {
      inEventHandler: 0,
      removeAllEventListeners: function () {
        for (var i = JSEvents.eventHandlers.length - 1; i >= 0; --i) {
          JSEvents._removeHandler(i);
        }
        JSEvents.eventHandlers = [];
        JSEvents.deferredCalls = [];
      },
      registerRemoveEventListeners: function () {
        if (!JSEvents.removeEventListenersRegistered) {
          JSEvents.removeEventListenersRegistered = true;
        }
      },
      deferredCalls: [],
      deferCall: function (targetFunction, precedence, argsList) {
        function arraysHaveEqualContent(arrA, arrB) {
          if (arrA.length != arrB.length) return false;
          for (var i in arrA) {
            if (arrA[i] != arrB[i]) return false;
          }
          return true;
        }
        for (var i in JSEvents.deferredCalls) {
          var call = JSEvents.deferredCalls[i];
          if (
            call.targetFunction == targetFunction &&
            arraysHaveEqualContent(call.argsList, argsList)
          ) {
            return;
          }
        }
        JSEvents.deferredCalls.push({
          targetFunction: targetFunction,
          precedence: precedence,
          argsList: argsList,
        });
        JSEvents.deferredCalls.sort(function (x, y) {
          return x.precedence < y.precedence;
        });
      },
      removeDeferredCalls: function (targetFunction) {
        for (var i = 0; i < JSEvents.deferredCalls.length; ++i) {
          if (JSEvents.deferredCalls[i].targetFunction == targetFunction) {
            JSEvents.deferredCalls.splice(i, 1);
            --i;
          }
        }
      },
      canPerformEventHandlerRequests: function () {
        return (
          JSEvents.inEventHandler &&
          JSEvents.currentEventHandler.allowsDeferredCalls
        );
      },
      runDeferredCalls: function () {
        if (!JSEvents.canPerformEventHandlerRequests()) {
          return;
        }
        for (var i = 0; i < JSEvents.deferredCalls.length; ++i) {
          var call = JSEvents.deferredCalls[i];
          JSEvents.deferredCalls.splice(i, 1);
          --i;
          call.targetFunction.apply(null, call.argsList);
        }
      },
      eventHandlers: [],
      removeAllHandlersOnTarget: function (target, eventTypeString) {
        for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
          if (
            JSEvents.eventHandlers[i].target == target &&
            (!eventTypeString ||
              eventTypeString == JSEvents.eventHandlers[i].eventTypeString)
          ) {
            JSEvents._removeHandler(i--);
          }
        }
      },
      _removeHandler: function (i) {
        var h = JSEvents.eventHandlers[i];
        h.target.removeEventListener(
          h.eventTypeString,
          h.eventListenerFunc,
          h.useCapture
        );
        JSEvents.eventHandlers.splice(i, 1);
      },
      registerOrRemoveHandler: function (eventHandler) {
        var jsEventHandler = function jsEventHandler(event) {
          ++JSEvents.inEventHandler;
          JSEvents.currentEventHandler = eventHandler;
          JSEvents.runDeferredCalls();
          eventHandler.handlerFunc(event);
          JSEvents.runDeferredCalls();
          --JSEvents.inEventHandler;
        };
        if (eventHandler.callbackfunc) {
          eventHandler.eventListenerFunc = jsEventHandler;
          eventHandler.target.addEventListener(
            eventHandler.eventTypeString,
            jsEventHandler,
            eventHandler.useCapture
          );
          JSEvents.eventHandlers.push(eventHandler);
          JSEvents.registerRemoveEventListeners();
        } else {
          for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
            if (
              JSEvents.eventHandlers[i].target == eventHandler.target &&
              JSEvents.eventHandlers[i].eventTypeString ==
                eventHandler.eventTypeString
            ) {
              JSEvents._removeHandler(i--);
            }
          }
        }
      },
      queueEventHandlerOnThread_iiii: function (
        targetThread,
        eventHandlerFunc,
        eventTypeId,
        eventData,
        userData
      ) {
        var stackTop = stackSave();
        var varargs = stackAlloc(12);
        GROWABLE_HEAP_I32()[varargs >> 2] = eventTypeId;
        GROWABLE_HEAP_I32()[(varargs + 4) >> 2] = eventData;
        GROWABLE_HEAP_I32()[(varargs + 8) >> 2] = userData;
        __emscripten_call_on_thread(
          0,
          targetThread,
          637534208,
          eventHandlerFunc,
          eventData,
          varargs
        );
        stackRestore(stackTop);
      },
      getTargetThreadForEventCallback: function (targetThread) {
        switch (targetThread) {
          case 1:
            return 0;
          case 2:
            return PThread.currentProxiedOperationCallerThread;
          default:
            return targetThread;
        }
      },
      getNodeNameForTarget: function (target) {
        if (!target) return "";
        if (target == window) return "#window";
        if (target == screen) return "#screen";
        return target && target.nodeName ? target.nodeName : "";
      },
      fullscreenEnabled: function () {
        return document.fullscreenEnabled || document.webkitFullscreenEnabled;
      },
    };
    function stringToNewUTF8(jsString) {
      var length = lengthBytesUTF8(jsString) + 1;
      var cString = _malloc(length);
      stringToUTF8(jsString, cString, length);
      return cString;
    }
    function _emscripten_set_offscreencanvas_size_on_target_thread_js(
      targetThread,
      targetCanvas,
      width,
      height
    ) {
      var stackTop = stackSave();
      var varargs = stackAlloc(12);
      var targetCanvasPtr = 0;
      if (targetCanvas) {
        targetCanvasPtr = stringToNewUTF8(targetCanvas);
      }
      GROWABLE_HEAP_I32()[varargs >> 2] = targetCanvasPtr;
      GROWABLE_HEAP_I32()[(varargs + 4) >> 2] = width;
      GROWABLE_HEAP_I32()[(varargs + 8) >> 2] = height;
      __emscripten_call_on_thread(
        0,
        targetThread,
        657457152,
        0,
        targetCanvasPtr,
        varargs
      );
      stackRestore(stackTop);
    }
    function _emscripten_set_offscreencanvas_size_on_target_thread(
      targetThread,
      targetCanvas,
      width,
      height
    ) {
      targetCanvas = targetCanvas ? UTF8ToString(targetCanvas) : "";
      _emscripten_set_offscreencanvas_size_on_target_thread_js(
        targetThread,
        targetCanvas,
        width,
        height
      );
    }
    function maybeCStringToJsString(cString) {
      return cString > 2 ? UTF8ToString(cString) : cString;
    }
    var specialHTMLTargets = [
      0,
      typeof document !== "undefined" ? document : 0,
      typeof window !== "undefined" ? window : 0,
    ];
    function findEventTarget(target) {
      target = maybeCStringToJsString(target);
      var domElement =
        specialHTMLTargets[target] ||
        (typeof document !== "undefined"
          ? document.querySelector(target)
          : undefined);
      return domElement;
    }
    function findCanvasEventTarget(target) {
      return findEventTarget(target);
    }
    function _emscripten_set_canvas_element_size_calling_thread(
      target,
      width,
      height
    ) {
      var canvas = findCanvasEventTarget(target);
      if (!canvas) return -4;
      if (canvas.canvasSharedPtr) {
        GROWABLE_HEAP_I32()[canvas.canvasSharedPtr >> 2] = width;
        GROWABLE_HEAP_I32()[(canvas.canvasSharedPtr + 4) >> 2] = height;
      }
      if (canvas.offscreenCanvas || !canvas.controlTransferredOffscreen) {
        if (canvas.offscreenCanvas) canvas = canvas.offscreenCanvas;
        var autoResizeViewport = false;
        if (canvas.GLctxObject && canvas.GLctxObject.GLctx) {
          var prevViewport = canvas.GLctxObject.GLctx.getParameter(2978);
          autoResizeViewport =
            prevViewport[0] === 0 &&
            prevViewport[1] === 0 &&
            prevViewport[2] === canvas.width &&
            prevViewport[3] === canvas.height;
        }
        canvas.width = width;
        canvas.height = height;
        if (autoResizeViewport) {
          canvas.GLctxObject.GLctx.viewport(0, 0, width, height);
        }
      } else if (canvas.canvasSharedPtr) {
        var targetThread =
          GROWABLE_HEAP_I32()[(canvas.canvasSharedPtr + 8) >> 2];
        _emscripten_set_offscreencanvas_size_on_target_thread(
          targetThread,
          target,
          width,
          height
        );
        return 1;
      } else {
        return -4;
      }
      return 0;
    }
    function _emscripten_set_canvas_element_size_main_thread(
      target,
      width,
      height
    ) {
      if (ENVIRONMENT_IS_PTHREAD)
        return _emscripten_proxy_to_main_thread_js(4, 1, target, width, height);
      return _emscripten_set_canvas_element_size_calling_thread(
        target,
        width,
        height
      );
    }
    function _emscripten_set_canvas_element_size(target, width, height) {
      var canvas = findCanvasEventTarget(target);
      if (canvas) {
        return _emscripten_set_canvas_element_size_calling_thread(
          target,
          width,
          height
        );
      } else {
        return _emscripten_set_canvas_element_size_main_thread(
          target,
          width,
          height
        );
      }
    }
    function _emscripten_set_current_thread_status(newStatus) {}
    function __webgl_enable_ANGLE_instanced_arrays(ctx) {
      var ext = ctx.getExtension("ANGLE_instanced_arrays");
      if (ext) {
        ctx["vertexAttribDivisor"] = function (index, divisor) {
          ext["vertexAttribDivisorANGLE"](index, divisor);
        };
        ctx["drawArraysInstanced"] = function (mode, first, count, primcount) {
          ext["drawArraysInstancedANGLE"](mode, first, count, primcount);
        };
        ctx["drawElementsInstanced"] = function (
          mode,
          count,
          type,
          indices,
          primcount
        ) {
          ext["drawElementsInstancedANGLE"](
            mode,
            count,
            type,
            indices,
            primcount
          );
        };
        return 1;
      }
    }
    function __webgl_enable_OES_vertex_array_object(ctx) {
      var ext = ctx.getExtension("OES_vertex_array_object");
      if (ext) {
        ctx["createVertexArray"] = function () {
          return ext["createVertexArrayOES"]();
        };
        ctx["deleteVertexArray"] = function (vao) {
          ext["deleteVertexArrayOES"](vao);
        };
        ctx["bindVertexArray"] = function (vao) {
          ext["bindVertexArrayOES"](vao);
        };
        ctx["isVertexArray"] = function (vao) {
          return ext["isVertexArrayOES"](vao);
        };
        return 1;
      }
    }
    function __webgl_enable_WEBGL_draw_buffers(ctx) {
      var ext = ctx.getExtension("WEBGL_draw_buffers");
      if (ext) {
        ctx["drawBuffers"] = function (n, bufs) {
          ext["drawBuffersWEBGL"](n, bufs);
        };
        return 1;
      }
    }
    function __webgl_enable_WEBGL_multi_draw(ctx) {
      return !!(ctx.multiDrawWebgl = ctx.getExtension("WEBGL_multi_draw"));
    }
    var GL = {
      counter: 1,
      buffers: [],
      programs: [],
      framebuffers: [],
      renderbuffers: [],
      textures: [],
      shaders: [],
      vaos: [],
      contexts: {},
      offscreenCanvases: {},
      queries: [],
      stringCache: {},
      unpackAlignment: 4,
      recordError: function recordError(errorCode) {
        if (!GL.lastError) {
          GL.lastError = errorCode;
        }
      },
      getNewId: function (table) {
        var ret = GL.counter++;
        for (var i = table.length; i < ret; i++) {
          table[i] = null;
        }
        return ret;
      },
      getSource: function (shader, count, string, length) {
        var source = "";
        for (var i = 0; i < count; ++i) {
          var len = length ? GROWABLE_HEAP_I32()[(length + i * 4) >> 2] : -1;
          source += UTF8ToString(
            GROWABLE_HEAP_I32()[(string + i * 4) >> 2],
            len < 0 ? undefined : len
          );
        }
        return source;
      },
      createContext: function (canvas, webGLContextAttributes) {
        if (!canvas.getContextSafariWebGL2Fixed) {
          canvas.getContextSafariWebGL2Fixed = canvas.getContext;
          canvas.getContext = function (ver, attrs) {
            var gl = canvas.getContextSafariWebGL2Fixed(ver, attrs);
            return (ver == "webgl") == gl instanceof WebGLRenderingContext
              ? gl
              : null;
          };
        }
        var ctx = canvas.getContext("webgl", webGLContextAttributes);
        if (!ctx) return 0;
        var handle = GL.registerContext(ctx, webGLContextAttributes);
        return handle;
      },
      registerContext: function (ctx, webGLContextAttributes) {
        var handle = _malloc(8);
        GROWABLE_HEAP_I32()[(handle + 4) >> 2] = _pthread_self();
        var context = {
          handle: handle,
          attributes: webGLContextAttributes,
          version: webGLContextAttributes.majorVersion,
          GLctx: ctx,
        };
        if (ctx.canvas) ctx.canvas.GLctxObject = context;
        GL.contexts[handle] = context;
        if (
          typeof webGLContextAttributes.enableExtensionsByDefault ===
            "undefined" ||
          webGLContextAttributes.enableExtensionsByDefault
        ) {
          GL.initExtensions(context);
        }
        return handle;
      },
      makeContextCurrent: function (contextHandle) {
        GL.currentContext = GL.contexts[contextHandle];
        Module.ctx = GLctx = GL.currentContext && GL.currentContext.GLctx;
        return !(contextHandle && !GLctx);
      },
      getContext: function (contextHandle) {
        return GL.contexts[contextHandle];
      },
      deleteContext: function (contextHandle) {
        if (GL.currentContext === GL.contexts[contextHandle])
          GL.currentContext = null;
        if (typeof JSEvents === "object")
          JSEvents.removeAllHandlersOnTarget(
            GL.contexts[contextHandle].GLctx.canvas
          );
        if (
          GL.contexts[contextHandle] &&
          GL.contexts[contextHandle].GLctx.canvas
        )
          GL.contexts[contextHandle].GLctx.canvas.GLctxObject = undefined;
        _free(GL.contexts[contextHandle].handle);
        GL.contexts[contextHandle] = null;
      },
      initExtensions: function (context) {
        if (!context) context = GL.currentContext;
        if (context.initExtensionsDone) return;
        context.initExtensionsDone = true;
        var GLctx = context.GLctx;
        __webgl_enable_ANGLE_instanced_arrays(GLctx);
        __webgl_enable_OES_vertex_array_object(GLctx);
        __webgl_enable_WEBGL_draw_buffers(GLctx);
        {
          GLctx.disjointTimerQueryExt = GLctx.getExtension(
            "EXT_disjoint_timer_query"
          );
        }
        __webgl_enable_WEBGL_multi_draw(GLctx);
        var exts = GLctx.getSupportedExtensions() || [];
        exts.forEach(function (ext) {
          if (!ext.includes("lose_context") && !ext.includes("debug")) {
            GLctx.getExtension(ext);
          }
        });
      },
    };
    var __emscripten_webgl_power_preferences = [
      "default",
      "low-power",
      "high-performance",
    ];
    function _emscripten_webgl_do_create_context(target, attributes) {
      var a = attributes >> 2;
      var powerPreference = GROWABLE_HEAP_I32()[a + (24 >> 2)];
      var contextAttributes = {
        alpha: !!GROWABLE_HEAP_I32()[a + (0 >> 2)],
        depth: !!GROWABLE_HEAP_I32()[a + (4 >> 2)],
        stencil: !!GROWABLE_HEAP_I32()[a + (8 >> 2)],
        antialias: !!GROWABLE_HEAP_I32()[a + (12 >> 2)],
        premultipliedAlpha: !!GROWABLE_HEAP_I32()[a + (16 >> 2)],
        preserveDrawingBuffer: !!GROWABLE_HEAP_I32()[a + (20 >> 2)],
        powerPreference: __emscripten_webgl_power_preferences[powerPreference],
        failIfMajorPerformanceCaveat: !!GROWABLE_HEAP_I32()[a + (28 >> 2)],
        majorVersion: GROWABLE_HEAP_I32()[a + (32 >> 2)],
        minorVersion: GROWABLE_HEAP_I32()[a + (36 >> 2)],
        enableExtensionsByDefault: GROWABLE_HEAP_I32()[a + (40 >> 2)],
        explicitSwapControl: GROWABLE_HEAP_I32()[a + (44 >> 2)],
        proxyContextToMainThread: GROWABLE_HEAP_I32()[a + (48 >> 2)],
        renderViaOffscreenBackBuffer: GROWABLE_HEAP_I32()[a + (52 >> 2)],
      };
      var canvas = findCanvasEventTarget(target);
      if (!canvas) {
        return 0;
      }
      if (contextAttributes.explicitSwapControl) {
        return 0;
      }
      var contextHandle = GL.createContext(canvas, contextAttributes);
      return contextHandle;
    }
    function _emscripten_webgl_create_context(a0, a1) {
      return _emscripten_webgl_do_create_context(a0, a1);
    }
    function _fd_close(fd) {
      if (ENVIRONMENT_IS_PTHREAD)
        return _emscripten_proxy_to_main_thread_js(5, 1, fd);
      return 0;
    }
    function _fd_read(fd, iov, iovcnt, pnum) {
      if (ENVIRONMENT_IS_PTHREAD)
        return _emscripten_proxy_to_main_thread_js(6, 1, fd, iov, iovcnt, pnum);
      var stream = SYSCALLS.getStreamFromFD(fd);
      var num = SYSCALLS.doReadv(stream, iov, iovcnt);
      GROWABLE_HEAP_I32()[pnum >> 2] = num;
      return 0;
    }
    function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
      if (ENVIRONMENT_IS_PTHREAD)
        return _emscripten_proxy_to_main_thread_js(
          7,
          1,
          fd,
          offset_low,
          offset_high,
          whence,
          newOffset
        );
    }
    function _fd_write(fd, iov, iovcnt, pnum) {
      if (ENVIRONMENT_IS_PTHREAD)
        return _emscripten_proxy_to_main_thread_js(8, 1, fd, iov, iovcnt, pnum);
      var num = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = GROWABLE_HEAP_I32()[(iov + i * 8) >> 2];
        var len = GROWABLE_HEAP_I32()[(iov + (i * 8 + 4)) >> 2];
        for (var j = 0; j < len; j++) {
          SYSCALLS.printChar(fd, GROWABLE_HEAP_U8()[ptr + j]);
        }
        num += len;
      }
      GROWABLE_HEAP_I32()[pnum >> 2] = num;
      return 0;
    }
    function _getTempRet0() {
      return getTempRet0();
    }
    function _pthread_cleanup_pop(execute) {
      var routine = PThread.threadExitHandlers.pop();
      if (execute) routine();
    }
    function spawnThread(threadParams) {
      if (ENVIRONMENT_IS_PTHREAD)
        throw "Internal Error! spawnThread() can only ever be called from main application thread!";
      var worker = PThread.getNewWorker();
      if (!worker) {
        return 6;
      }
      if (worker.pthread !== undefined) throw "Internal error!";
      if (!threadParams.pthread_ptr) throw "Internal error, no pthread ptr!";
      PThread.runningWorkers.push(worker);
      var tlsMemory = _malloc(128 * 4);
      for (var i = 0; i < 128; ++i) {
        GROWABLE_HEAP_I32()[(tlsMemory + i * 4) >> 2] = 0;
      }
      var stackHigh = threadParams.stackBase + threadParams.stackSize;
      var pthread = (PThread.pthreads[threadParams.pthread_ptr] = {
        worker: worker,
        stackBase: threadParams.stackBase,
        stackSize: threadParams.stackSize,
        allocatedOwnStack: threadParams.allocatedOwnStack,
        threadInfoStruct: threadParams.pthread_ptr,
      });
      var tis = pthread.threadInfoStruct >> 2;
      Atomics.store(
        GROWABLE_HEAP_U32(),
        tis + (64 >> 2),
        threadParams.detached
      );
      Atomics.store(GROWABLE_HEAP_U32(), tis + (100 >> 2), tlsMemory);
      Atomics.store(
        GROWABLE_HEAP_U32(),
        tis + (40 >> 2),
        pthread.threadInfoStruct
      );
      Atomics.store(
        GROWABLE_HEAP_U32(),
        tis + (80 >> 2),
        threadParams.stackSize
      );
      Atomics.store(GROWABLE_HEAP_U32(), tis + (76 >> 2), stackHigh);
      Atomics.store(
        GROWABLE_HEAP_U32(),
        tis + (104 >> 2),
        threadParams.stackSize
      );
      Atomics.store(GROWABLE_HEAP_U32(), tis + ((104 + 8) >> 2), stackHigh);
      Atomics.store(
        GROWABLE_HEAP_U32(),
        tis + ((104 + 12) >> 2),
        threadParams.detached
      );
      var global_libc = _emscripten_get_global_libc();
      var global_locale = global_libc + 40;
      Atomics.store(GROWABLE_HEAP_U32(), tis + (172 >> 2), global_locale);
      worker.pthread = pthread;
      var msg = {
        cmd: "run",
        start_routine: threadParams.startRoutine,
        arg: threadParams.arg,
        threadInfoStruct: threadParams.pthread_ptr,
        stackBase: threadParams.stackBase,
        stackSize: threadParams.stackSize,
      };
      worker.runPthread = function () {
        msg.time = performance.now();
        worker.postMessage(msg, threadParams.transferList);
      };
      if (worker.loaded) {
        worker.runPthread();
        delete worker.runPthread;
      }
      return 0;
    }
    function _pthread_create(pthread_ptr, attr, start_routine, arg) {
      if (typeof SharedArrayBuffer === "undefined") {
        err(
          "Current environment does not support SharedArrayBuffer, pthreads are not available!"
        );
        return 6;
      }
      if (!pthread_ptr) {
        err("pthread_create called with a null thread pointer!");
        return 28;
      }
      var transferList = [];
      var error = 0;
      if (ENVIRONMENT_IS_PTHREAD && (transferList.length === 0 || error)) {
        return _emscripten_sync_run_in_main_thread_4(
          687865856,
          pthread_ptr,
          attr,
          start_routine,
          arg
        );
      }
      var stackSize = 0;
      var stackBase = 0;
      var detached = 0;
      if (attr && attr != -1) {
        stackSize = GROWABLE_HEAP_I32()[attr >> 2];
        stackSize += 81920;
        stackBase = GROWABLE_HEAP_I32()[(attr + 8) >> 2];
        detached = GROWABLE_HEAP_I32()[(attr + 12) >> 2] !== 0;
      } else {
        stackSize = 2097152;
      }
      var allocatedOwnStack = stackBase == 0;
      if (allocatedOwnStack) {
        stackBase = _memalign(16, stackSize);
      } else {
        stackBase -= stackSize;
        assert(stackBase > 0);
      }
      var threadInfoStruct = _malloc(228);
      for (var i = 0; i < 228 >> 2; ++i)
        GROWABLE_HEAP_U32()[(threadInfoStruct >> 2) + i] = 0;
      GROWABLE_HEAP_I32()[pthread_ptr >> 2] = threadInfoStruct;
      GROWABLE_HEAP_I32()[(threadInfoStruct + 12) >> 2] = threadInfoStruct;
      var headPtr = threadInfoStruct + 152;
      GROWABLE_HEAP_I32()[headPtr >> 2] = headPtr;
      var threadParams = {
        stackBase: stackBase,
        stackSize: stackSize,
        allocatedOwnStack: allocatedOwnStack,
        detached: detached,
        startRoutine: start_routine,
        pthread_ptr: threadInfoStruct,
        arg: arg,
        transferList: transferList,
      };
      if (ENVIRONMENT_IS_PTHREAD) {
        threadParams.cmd = "spawnThread";
        postMessage(threadParams, transferList);
        return 0;
      }
      return spawnThread(threadParams);
    }
    function __pthread_testcancel_js() {
      if (!ENVIRONMENT_IS_PTHREAD) return;
      var tb = _pthread_self();
      if (!tb) return;
      var cancelDisabled = Atomics.load(GROWABLE_HEAP_U32(), (tb + 56) >> 2);
      if (cancelDisabled) return;
      var canceled = Atomics.load(GROWABLE_HEAP_U32(), (tb + 0) >> 2);
      if (canceled == 2) throw "Canceled!";
    }
    function __emscripten_do_pthread_join(thread, status, block) {
      if (!thread) {
        err("pthread_join attempted on a null thread pointer!");
        return ERRNO_CODES.ESRCH;
      }
      if (ENVIRONMENT_IS_PTHREAD && _pthread_self() == thread) {
        err("PThread " + thread + " is attempting to join to itself!");
        return ERRNO_CODES.EDEADLK;
      } else if (
        !ENVIRONMENT_IS_PTHREAD &&
        _emscripten_main_browser_thread_id() == thread
      ) {
        err("Main thread " + thread + " is attempting to join to itself!");
        return ERRNO_CODES.EDEADLK;
      }
      var self = GROWABLE_HEAP_I32()[(thread + 12) >> 2];
      if (self !== thread) {
        err(
          "pthread_join attempted on thread " +
            thread +
            ", which does not point to a valid thread, or does not exist anymore!"
        );
        return ERRNO_CODES.ESRCH;
      }
      var detached = Atomics.load(GROWABLE_HEAP_U32(), (thread + 64) >> 2);
      if (detached) {
        err(
          "Attempted to join thread " + thread + ", which was already detached!"
        );
        return ERRNO_CODES.EINVAL;
      }
      for (;;) {
        var threadStatus = Atomics.load(GROWABLE_HEAP_U32(), (thread + 0) >> 2);
        if (threadStatus == 1) {
          var threadExitCode = Atomics.load(
            GROWABLE_HEAP_U32(),
            (thread + 4) >> 2
          );
          if (status) GROWABLE_HEAP_I32()[status >> 2] = threadExitCode;
          Atomics.store(GROWABLE_HEAP_U32(), (thread + 64) >> 2, 1);
          if (!ENVIRONMENT_IS_PTHREAD) cleanupThread(thread);
          else postMessage({ cmd: "cleanupThread", thread: thread });
          return 0;
        }
        if (!block) {
          return ERRNO_CODES.EBUSY;
        }
        __pthread_testcancel_js();
        if (!ENVIRONMENT_IS_PTHREAD)
          _emscripten_main_thread_process_queued_calls();
        _emscripten_futex_wait(
          thread + 0,
          threadStatus,
          ENVIRONMENT_IS_PTHREAD ? 100 : 1
        );
      }
    }
    function _pthread_join(thread, status) {
      return __emscripten_do_pthread_join(thread, status, true);
    }
    function _setTempRet0(val) {
      setTempRet0(val);
    }
    function _time(ptr) {
      var ret = (Date.now() / 1e3) | 0;
      if (ptr) {
        GROWABLE_HEAP_I32()[ptr >> 2] = ret;
      }
      return ret;
    }
    if (!ENVIRONMENT_IS_PTHREAD) PThread.initMainThreadBlock();
    InternalError = Module["InternalError"] = extendError(
      Error,
      "InternalError"
    );
    embind_init_charCodes();
    BindingError = Module["BindingError"] = extendError(Error, "BindingError");
    init_emval();
    UnboundTypeError = Module["UnboundTypeError"] = extendError(
      Error,
      "UnboundTypeError"
    );
    var GLctx;
    var proxiedFunctionTable = [
      null,
      ___sys_fcntl64,
      ___sys_ioctl,
      ___sys_open,
      _emscripten_set_canvas_element_size_main_thread,
      _fd_close,
      _fd_read,
      _fd_seek,
      _fd_write,
    ];
    var asmLibraryArg = {
      k: ___assert_fail,
      C: ___cxa_thread_atexit,
      u: ___sys_fcntl64,
      P: ___sys_ioctl,
      R: ___sys_open,
      F: __embind_finalize_value_object,
      I: __embind_register_bigint,
      aa: __embind_register_bool,
      $: __embind_register_emval,
      z: __embind_register_float,
      E: __embind_register_function,
      j: __embind_register_integer,
      g: __embind_register_memory_view,
      A: __embind_register_std_string,
      r: __embind_register_std_wstring,
      K: __embind_register_value_object,
      h: __embind_register_value_object_field,
      ba: __embind_register_void,
      Z: __emscripten_notify_thread_queue,
      o: __emval_decref,
      _: __emval_get_global,
      D: __emval_incref,
      Q: __emval_new,
      i: _abort,
      y: _emscripten_asm_const_int,
      V: _emscripten_check_blocking_allowed,
      x: _emscripten_conditional_set_current_thread_status,
      l: _emscripten_futex_wait,
      m: _emscripten_futex_wake,
      p: _emscripten_get_now,
      e: _emscripten_longjmp,
      M: _emscripten_memcpy_big,
      ea: _emscripten_num_logical_cores,
      W: _emscripten_receive_on_main_thread_js,
      N: _emscripten_resize_heap,
      X: _emscripten_set_canvas_element_size,
      w: _emscripten_set_current_thread_status,
      Y: _emscripten_webgl_create_context,
      v: _fd_close,
      O: _fd_read,
      H: _fd_seek,
      S: _fd_write,
      c: _getTempRet0,
      L: initPthreadsJS,
      q: invoke_iiiii,
      s: invoke_iiiiiiiii,
      t: invoke_iiiiiiiiii,
      J: invoke_iiiiiiiiiiii,
      G: invoke_ijiii,
      n: invoke_vi,
      f: invoke_vii,
      d: invoke_viiii,
      a: wasmMemory || Module["wasmMemory"],
      T: _pthread_cleanup_pop,
      U: _pthread_cleanup_push,
      B: _pthread_create,
      ca: _pthread_join,
      b: _setTempRet0,
      da: _time,
    };
    createWasm();
    Module["___wasm_call_ctors"] = function () {
      return (Module["___wasm_call_ctors"] = Module["asm"]["fa"]).apply(
        null,
        arguments
      );
    };
    var _malloc = (Module["_malloc"] = function () {
      return (_malloc = Module["_malloc"] = Module["asm"]["ga"]).apply(
        null,
        arguments
      );
    });
    var _free = (Module["_free"] = function () {
      return (_free = Module["_free"] = Module["asm"]["ha"]).apply(
        null,
        arguments
      );
    });
    Module["_emscripten_tls_init"] = function () {
      return (Module["_emscripten_tls_init"] = Module["asm"]["ia"]).apply(
        null,
        arguments
      );
    };
    var ___getTypeName = (Module["___getTypeName"] = function () {
      return (___getTypeName = Module["___getTypeName"] =
        Module["asm"]["ka"]).apply(null, arguments);
    });
    Module["___embind_register_native_and_builtin_types"] = function () {
      return (Module["___embind_register_native_and_builtin_types"] =
        Module["asm"]["la"]).apply(null, arguments);
    };
    Module["_emscripten_current_thread_process_queued_calls"] = function () {
      return (Module["_emscripten_current_thread_process_queued_calls"] =
        Module["asm"]["ma"]).apply(null, arguments);
    };
    var _emscripten_register_main_browser_thread_id = (Module[
      "_emscripten_register_main_browser_thread_id"
    ] = function () {
      return (_emscripten_register_main_browser_thread_id = Module[
        "_emscripten_register_main_browser_thread_id"
      ] =
        Module["asm"]["na"]).apply(null, arguments);
    });
    var _emscripten_main_browser_thread_id = (Module[
      "_emscripten_main_browser_thread_id"
    ] = function () {
      return (_emscripten_main_browser_thread_id = Module[
        "_emscripten_main_browser_thread_id"
      ] =
        Module["asm"]["oa"]).apply(null, arguments);
    });
    var __emscripten_do_dispatch_to_thread = (Module[
      "__emscripten_do_dispatch_to_thread"
    ] = function () {
      return (__emscripten_do_dispatch_to_thread = Module[
        "__emscripten_do_dispatch_to_thread"
      ] =
        Module["asm"]["pa"]).apply(null, arguments);
    });
    var _emscripten_sync_run_in_main_thread_4 = (Module[
      "_emscripten_sync_run_in_main_thread_4"
    ] = function () {
      return (_emscripten_sync_run_in_main_thread_4 = Module[
        "_emscripten_sync_run_in_main_thread_4"
      ] =
        Module["asm"]["qa"]).apply(null, arguments);
    });
    var _emscripten_main_thread_process_queued_calls = (Module[
      "_emscripten_main_thread_process_queued_calls"
    ] = function () {
      return (_emscripten_main_thread_process_queued_calls = Module[
        "_emscripten_main_thread_process_queued_calls"
      ] =
        Module["asm"]["ra"]).apply(null, arguments);
    });
    var _emscripten_run_in_main_runtime_thread_js = (Module[
      "_emscripten_run_in_main_runtime_thread_js"
    ] = function () {
      return (_emscripten_run_in_main_runtime_thread_js = Module[
        "_emscripten_run_in_main_runtime_thread_js"
      ] =
        Module["asm"]["sa"]).apply(null, arguments);
    });
    var __emscripten_call_on_thread = (Module["__emscripten_call_on_thread"] =
      function () {
        return (__emscripten_call_on_thread = Module[
          "__emscripten_call_on_thread"
        ] =
          Module["asm"]["ta"]).apply(null, arguments);
      });
    var __emscripten_thread_init = (Module["__emscripten_thread_init"] =
      function () {
        return (__emscripten_thread_init = Module["__emscripten_thread_init"] =
          Module["asm"]["ua"]).apply(null, arguments);
      });
    var _pthread_self = (Module["_pthread_self"] = function () {
      return (_pthread_self = Module["_pthread_self"] =
        Module["asm"]["va"]).apply(null, arguments);
    });
    var ___pthread_tsd_run_dtors = (Module["___pthread_tsd_run_dtors"] =
      function () {
        return (___pthread_tsd_run_dtors = Module["___pthread_tsd_run_dtors"] =
          Module["asm"]["wa"]).apply(null, arguments);
      });
    var _emscripten_get_global_libc = (Module["_emscripten_get_global_libc"] =
      function () {
        return (_emscripten_get_global_libc = Module[
          "_emscripten_get_global_libc"
        ] =
          Module["asm"]["xa"]).apply(null, arguments);
      });
    var stackSave = (Module["stackSave"] = function () {
      return (stackSave = Module["stackSave"] = Module["asm"]["ya"]).apply(
        null,
        arguments
      );
    });
    var stackRestore = (Module["stackRestore"] = function () {
      return (stackRestore = Module["stackRestore"] =
        Module["asm"]["za"]).apply(null, arguments);
    });
    var stackAlloc = (Module["stackAlloc"] = function () {
      return (stackAlloc = Module["stackAlloc"] = Module["asm"]["Aa"]).apply(
        null,
        arguments
      );
    });
    var _emscripten_stack_set_limits = (Module["_emscripten_stack_set_limits"] =
      function () {
        return (_emscripten_stack_set_limits = Module[
          "_emscripten_stack_set_limits"
        ] =
          Module["asm"]["Ba"]).apply(null, arguments);
      });
    var _setThrew = (Module["_setThrew"] = function () {
      return (_setThrew = Module["_setThrew"] = Module["asm"]["Ca"]).apply(
        null,
        arguments
      );
    });
    var _memalign = (Module["_memalign"] = function () {
      return (_memalign = Module["_memalign"] = Module["asm"]["Da"]).apply(
        null,
        arguments
      );
    });
    Module["dynCall_jiiiiiiiii"] = function () {
      return (Module["dynCall_jiiiiiiiii"] = Module["asm"]["Ea"]).apply(
        null,
        arguments
      );
    };
    var dynCall_ijiii = (Module["dynCall_ijiii"] = function () {
      return (dynCall_ijiii = Module["dynCall_ijiii"] =
        Module["asm"]["Fa"]).apply(null, arguments);
    });
    Module["dynCall_jiji"] = function () {
      return (Module["dynCall_jiji"] = Module["asm"]["Ga"]).apply(
        null,
        arguments
      );
    };
    Module["dynCall_jiiiiiiii"] = function () {
      return (Module["dynCall_jiiiiiiii"] = Module["asm"]["Ha"]).apply(
        null,
        arguments
      );
    };
    Module["dynCall_jiiiiii"] = function () {
      return (Module["dynCall_jiiiiii"] = Module["asm"]["Ia"]).apply(
        null,
        arguments
      );
    };
    Module["dynCall_jiiiii"] = function () {
      return (Module["dynCall_jiiiii"] = Module["asm"]["Ja"]).apply(
        null,
        arguments
      );
    };
    Module["dynCall_iiijii"] = function () {
      return (Module["dynCall_iiijii"] = Module["asm"]["Ka"]).apply(
        null,
        arguments
      );
    };
    var __emscripten_allow_main_runtime_queued_calls = (Module[
      "__emscripten_allow_main_runtime_queued_calls"
    ] = 600816);
    var __emscripten_main_thread_futex = (Module[
      "__emscripten_main_thread_futex"
    ] = 897300);
    function invoke_vi(index, a1) {
      var sp = stackSave();
      try {
        wasmTable.get(index)(a1);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp") throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_viiii(index, a1, a2, a3, a4) {
      var sp = stackSave();
      try {
        wasmTable.get(index)(a1, a2, a3, a4);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp") throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_vii(index, a1, a2) {
      var sp = stackSave();
      try {
        wasmTable.get(index)(a1, a2);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp") throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_iiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
      var sp = stackSave();
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp") throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_iiiiiiiiiiii(
      index,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11
    ) {
      var sp = stackSave();
      try {
        return wasmTable.get(index)(
          a1,
          a2,
          a3,
          a4,
          a5,
          a6,
          a7,
          a8,
          a9,
          a10,
          a11
        );
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp") throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_iiiii(index, a1, a2, a3, a4) {
      var sp = stackSave();
      try {
        return wasmTable.get(index)(a1, a2, a3, a4);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp") throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_iiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
      var sp = stackSave();
      try {
        return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp") throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_ijiii(index, a1, a2, a3, a4, a5) {
      var sp = stackSave();
      try {
        return dynCall_ijiii(index, a1, a2, a3, a4, a5);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp") throw e;
        _setThrew(1, 0);
      }
    }
    Module["PThread"] = PThread;
    Module["PThread"] = PThread;
    Module["wasmMemory"] = wasmMemory;
    Module["ExitStatus"] = ExitStatus;
    var calledRun;
    function ExitStatus(status) {
      this.name = "ExitStatus";
      this.message = "Program terminated with exit(" + status + ")";
      this.status = status;
    }
    dependenciesFulfilled = function runCaller() {
      if (!calledRun) run();
      if (!calledRun) dependenciesFulfilled = runCaller;
    };
    function run(args) {
      if (runDependencies > 0) {
        return;
      }
      if (ENVIRONMENT_IS_PTHREAD) {
        readyPromiseResolve(Module);
        initRuntime();
        postMessage({ cmd: "loaded" });
        return;
      }
      preRun();
      if (runDependencies > 0) {
        return;
      }
      function doRun() {
        if (calledRun) return;
        calledRun = true;
        Module["calledRun"] = true;
        if (ABORT) return;
        initRuntime();
        readyPromiseResolve(Module);
        if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
        postRun();
      }
      if (Module["setStatus"]) {
        Module["setStatus"]("Running...");
        setTimeout(function () {
          setTimeout(function () {
            Module["setStatus"]("");
          }, 1);
          doRun();
        }, 1);
      } else {
        doRun();
      }
    }
    Module["run"] = run;
    function exit(status, implicit) {
      if (implicit && keepRuntimeAlive() && status === 0) {
        return;
      }
      if (!implicit) {
        if (ENVIRONMENT_IS_PTHREAD) {
          postMessage({ cmd: "exitProcess", returnCode: status });
          throw new ExitStatus(status);
        }
      }
      if (keepRuntimeAlive());
      else {
        PThread.terminateAllThreads();
        if (Module["onExit"]) Module["onExit"](status);
        ABORT = true;
      }
      quit_(status, new ExitStatus(status));
    }
    if (Module["preInit"]) {
      if (typeof Module["preInit"] == "function")
        Module["preInit"] = [Module["preInit"]];
      while (Module["preInit"].length > 0) {
        Module["preInit"].pop()();
      }
    }
    if (ENVIRONMENT_IS_PTHREAD) {
      noExitRuntime = false;
      PThread.initWorker();
    }
    run();
    return Module.ready;
  };
})();
exports.default = Module;
