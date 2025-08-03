import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { subscribe,unsubscribe,onError,setDebugFlag,isEmpEnabled,} from 'lightning/empApi';


export default class DisconnectionNotice extends LightningElement {
    subscription = {};
    @track status;
    @track identifier;
    @api 
    channelName= '/event/Asset_Disconnection__e';

    connectedCallback() {
        console.log('connectedCallback() called');
        this.handleSubscribe();
    }

    renderedCallback(){
        console.log('renderedCallback() called');
    }

    disconnectedCallback() {
        //Implement your unsubscribing solution here
        // Invoke unsubscribe method of empApi
        this.handleUnsubscribe();
    }


    handleSubscribe() {
        //Implement your subscribing solution here 
        console.log('handleSubscribe() called');
        // Invoke subscribe method of empApi. Pass reference to messageCallback
        /*try{
            this.subscription = await subscribe(this.channelName, -1, this.messageCallback);
            console.log('Successfully subscribed to:', this.channelName);
        } catch(error){
            console.error('Error subscribing:', error);
        }*/

        // Callback invoked whenever a new event message is received
        const messageCallback = (response) => {
            console.log('messageCallback() New message received: ', JSON.stringify(response));
            // Response contains the payload of the new message received
            this.status = response.data.payload.Disconnected__c;
            this.identifier = response.data.payload.Asset_Identifier__c;
            console.log('messageCallback():response='+ response);
            console.log('messageCallback():status ='+this.status);
            console.log('messageCallback():identifier ='+this.identifier);

            if(this.status==true){
                this.showSuccessToast(this.identifier);
            }else{
                this.showErrorToast();
            }
        };
        subscribe(this.channelName, -1, messageCallback).then((response) => {
            // Response contains the subscription information on subscribe call
            console.log(
                'Subscription request sent to: ',
                JSON.stringify(response.channel)
            );
            this.subscription = response;
        }).catch(error => {
            console.error('Subscription error:', error);
        });
    }

    unsubscribeCallback = (response) => {
        console.log('unsubscribeCallback() called');
        console.log('unsubscribeResponse: ', JSON.stringify(response));
        this.subscription = null;
    }

    async handleUnsubscribe(){
        //Implement your unsubscribing solution here 
        console.log('handleUnsubscribe() called');
        if (this.subscription) {
            console.log('Unsubscribing - inside if ...');
            /*unsubscribe(this.subscription)
                .then(() => {
                    console.log('Unsubscribed from channel');
                    this.subscription = null;
                })
                .catch(error => {
                    console.error('Unsubscribe error:', error);
                });*/

            try{
                await unsubscribe(this.subscription, this.unsubscribeCallback);
                console.log('Successfully unsubscribed from:', this.channelName);
            }catch(error){
                console.error('Unsubscribe error:', error);
            }    
        }
    }

    showSuccessToast(assetId) {
        console.log('showSuccessToast() called');
        const event = new ShowToastEvent({
            title: 'Success',
            message: 'Asset Id '+assetId+' is now disconnected',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }

    showErrorToast() {
        console.log('showErrorToast() called');
        const event = new ShowToastEvent({
            title: 'Error',
            message: 'Asset was not disconnected. Try Again.',
            variant: 'error',
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }
}