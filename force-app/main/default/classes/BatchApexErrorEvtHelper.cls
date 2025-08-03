public class BatchApexErrorEvtHelper {
    public static void RecordErrorLog(List<BatchApexErrorEvent> batchApexEventLst){
        System.debug('RecordErrorLog() called='+batchApexEventLst);
        List <Error_Log__c> errLogLst = new List<Error_Log__c>();
        
        for(BatchApexErrorEvent be : batchApexEventLst ){
            Error_Log__c errLog = new Error_Log__c();
            errLog.Name = 'Batch Error';
            errLog.Async_Apex_Job_Id__c = be.AsyncApexJobId;
            errLog.Message__c = be.Message;
            errLog.Stacktrace__c = be.StackTrace;
            errLog.Type__c = be.ExceptionType;        
            errLogLst.add(errLog);
        }
        
        if(errLogLst.size() > 0){
            insert errLogLst;
        }
    }
}