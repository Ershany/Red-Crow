package io.github.ershany.blitzsms;

/**
 * Created by Brady on 9/21/2017.
 */

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.provider.Telephony;
import android.telephony.SmsManager;
import android.telephony.SmsMessage;
import android.util.Log;

import io.github.ershany.blitzsms.utils.OnSMS;

public class SmsListener extends BroadcastReceiver {

    private static final SmsListener singleton = new SmsListener();

    private static final SmsManager smsManager = SmsManager.getDefault();
    private static OnSMS smsHandle;


    private SmsListener() {
        // Default SMS Handle Declaration
        smsHandle = new OnSMS() {
            public void onSMS(String message) {
                Log.i("Default SMS", "Default Handle w/ msg: " + message);
            }
        };
    }

    public static SmsListener getInstance() {
        return singleton;
    }

    public static void setSMSHandle(OnSMS smsHandle) {
        SmsListener.smsHandle = smsHandle;
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        Bundle bundle = intent.getExtras();

        if(bundle != null) {
            try {
                SmsMessage[] smsMessages;
                Log.i("Attempting", "To Parse SMS");

                // Try to avoid using the deprecated createFromPdu but if its an old version, we will have to use it
                if(Build.VERSION.SDK_INT >= 19) { // KITKAT
                    smsMessages = Telephony.Sms.Intents.getMessagesFromIntent(intent);
                } else {
                    Object[] pdus = (Object[]) bundle.get("pdus");

                    smsMessages = new SmsMessage[pdus.length];
                    for(int i = 0; i < pdus.length; ++i) {
                        smsMessages[i] = SmsMessage.createFromPdu((byte[]) pdus[i]);
                    }
                }

                // Loop through all of the received SMS and filter them to only read the ones from the server
                String message = "";
                for(int i = 0; i < smsMessages.length; ++i) {
                    String phoneNumber = smsMessages[i].getDisplayOriginatingAddress();
                    Log.i("Text Received", "#: " + phoneNumber);
                    if(!phoneNumber.contains(context.getString(R.string.server_phonenumber))) continue;

                    message += smsMessages[i].getDisplayMessageBody();

                    Log.i("SMS Number", phoneNumber);
                    Log.i("SMS Message", message);
                }

                if(!message.isEmpty()) {
                    smsHandle.onSMS(message);
                }
            } catch(Exception e) {
                Log.d("Exception - SmsListener", e.getMessage());
            }
        }
    }

}
