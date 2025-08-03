trigger BatchApexErrorEvtTrg on BatchApexErrorEvent (after insert) {
	System.debug('BatchApexErrorEvtTrg() called...');
    
    if(Trigger.isAfter && Trigger.isInsert){
        System.debug('After Insert is ...');
        //BatchApexErrorEvtHelper helper = new BatchApexErrorEvtHelper();
        //helper.RecordErrorLog(trigger.new);
        BatchApexErrorEvtHelper.RecordErrorLog(Trigger.new);
    }
}