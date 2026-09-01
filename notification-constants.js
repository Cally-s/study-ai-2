(function(root,factory){
  const constants=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=constants;
  if(root)root.StudySparkNotificationConstants=constants;
})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';
  const NOTIFICATION_TOAST_DURATION_MS=2000;
  return Object.freeze({NOTIFICATION_TOAST_DURATION_MS});
});
