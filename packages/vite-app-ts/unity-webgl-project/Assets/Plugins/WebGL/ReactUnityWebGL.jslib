mergeInto(LibraryManager.library, {
  SetListenerState: function (message) {
    dispatchReactUnityEvent('SetListenerState', Pointer_stringify(message));
  },
});
