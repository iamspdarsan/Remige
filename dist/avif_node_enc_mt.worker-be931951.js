"use strict";
var require$$0 = require("worker_threads");
var require$$1 = require("fs");

function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { default: e };
}
function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== "default") {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(
          n,
          k,
          d.get
            ? d
            : {
                enumerable: true,
                get: function () {
                  return e[k];
                },
              }
        );
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}
var require$$0__default = /*#__PURE__*/ _interopDefaultLegacy(require$$0);
var require$$1__default = /*#__PURE__*/ _interopDefaultLegacy(require$$1);
var commonjsGlobal =
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof window !== "undefined"
    ? window
    : typeof global !== "undefined"
    ? global
    : typeof self !== "undefined"
    ? self
    : {};
function commonjsRequire(path) {
  throw new Error(
    'Could not dynamically require "' +
      path +
      '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.'
  );
}
var Module = {};
if (
  typeof process === "object" &&
  typeof process.versions === "object" &&
  typeof process.versions.node === "string"
) {
  var nodeWorkerThreads = require$$0__default["default"];
  var parentPort = nodeWorkerThreads.parentPort;
  parentPort.on("message", function (data) {
    onmessage({ data: data });
  });
  var nodeFS = require$$1__default["default"];
  Object.assign(commonjsGlobal, {
    self: commonjsGlobal,
    require: commonjsRequire,
    Module: Module,
    location: { href: __filename },
    Worker: nodeWorkerThreads.Worker,
    importScripts: function (f) {
      (0, eval)(nodeFS.readFileSync(f, "utf8"));
    },
    postMessage: function (msg) {
      parentPort.postMessage(msg);
    },
    performance: commonjsGlobal.performance || {
      now: function () {
        return Date.now();
      },
    },
  });
}
var initializedJS = false;
function threadPrintErr() {
  var text = Array.prototype.slice.call(arguments).join(" ");
  console.error(text);
}
function threadAlert() {
  var text = Array.prototype.slice.call(arguments).join(" ");
  postMessage({
    cmd: "alert",
    text: text,
    threadId: Module["_pthread_self"](),
  });
}
var err = threadPrintErr;
self.alert = threadAlert;
Module["instantiateWasm"] = function (info, receiveInstance) {
  var instance = new WebAssembly.Instance(Module["wasmModule"], info);
  receiveInstance(instance);
  Module["wasmModule"] = null;
  return instance.exports;
};
function moduleLoaded() {}
self.onmessage = function (e) {
  try {
    if (e.data.cmd === "load") {
      Module["wasmModule"] = e.data.wasmModule;
      Module["wasmMemory"] = e.data.wasmMemory;
      Module["buffer"] = Module["wasmMemory"].buffer;
      Module["ENVIRONMENT_IS_PTHREAD"] = true;
      (e.data.urlOrBlob
        ? Promise.resolve().then(function () {
            return /*#__PURE__*/ _interopNamespace(require(e.data.urlOrBlob));
          })
        : Promise.resolve().then(function () {
            return require("./avif_node_enc_mt-143090b9.js");
          })
      )
        .then(function (exports) {
          return exports.default(Module);
        })
        .then(function (instance) {
          Module = instance;
          moduleLoaded();
        });
    } else if (e.data.cmd === "objectTransfer") {
      Module["PThread"].receiveObjectTransfer(e.data);
    } else if (e.data.cmd === "run") {
      Module["__performance_now_clock_drift"] = performance.now() - e.data.time;
      Module["__emscripten_thread_init"](e.data.threadInfoStruct, 0, 0);
      var max = e.data.stackBase;
      var top = e.data.stackBase + e.data.stackSize;
      Module["establishStackSpace"](top, max);
      Module["PThread"].receiveObjectTransfer(e.data);
      Module["PThread"].threadInit();
      if (!initializedJS) {
        Module["___embind_register_native_and_builtin_types"]();
        initializedJS = true;
      }
      try {
        var result = Module["invokeEntryPoint"](
          e.data.start_routine,
          e.data.arg
        );
        if (Module["keepRuntimeAlive"]()) {
          Module["PThread"].setExitStatus(result);
        } else {
          Module["PThread"].threadExit(result);
        }
      } catch (ex) {
        if (ex === "Canceled!") {
          Module["PThread"].threadCancel();
        } else if (ex != "unwind") {
          if (ex instanceof Module["ExitStatus"]) {
            if (Module["keepRuntimeAlive"]()) {
            } else {
              Module["PThread"].threadExit(ex.status);
            }
          } else {
            Module["PThread"].threadExit(-2);
            throw ex;
          }
        }
      }
    } else if (e.data.cmd === "cancel") {
      if (Module["_pthread_self"]()) {
        Module["PThread"].threadCancel();
      }
    } else if (e.data.target === "setimmediate") {
    } else if (e.data.cmd === "processThreadQueue") {
      if (Module["_pthread_self"]()) {
        Module["_emscripten_current_thread_process_queued_calls"]();
      }
    } else {
      err("worker.js received unknown command " + e.data.cmd);
      err(e.data);
    }
  } catch (ex) {
    err("worker.js onmessage() captured an uncaught exception: " + ex);
    if (ex && ex.stack) err(ex.stack);
    throw ex;
  }
};
var avif_node_enc_mt_worker = {};
module.exports = avif_node_enc_mt_worker;
