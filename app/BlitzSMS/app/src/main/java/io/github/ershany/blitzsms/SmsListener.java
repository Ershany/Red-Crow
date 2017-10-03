package io.github.ershany.blitzsms;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.provider.Telephony;
import android.telephony.SmsManager;
import android.telephony.SmsMessage;
import android.util.Log;
import android.widget.EditText;
import android.widget.Toast;

import io.github.ershany.blitzsms.R;

/**
 * Created by Brady on 9/21/2017.
 */

public class SmsListener extends BroadcastReceiver {

    private final SmsManager smsManager = SmsManager.getDefault();

    @Override
    public void onReceive(Context context, Intent intent) {
        Bundle bundle = intent.getExtras();

        if(bundle != null) {
            try {
                SmsMessage[] smsMessages;

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
                for(int i = 0; i < smsMessages.length; ++i) {
                    String phoneNumber = smsMessages[i].getDisplayOriginatingAddress();
                    if(!phoneNumber.contains(context.getString(R.string.server_phonenumber))) continue;

                    String message = smsMessages[i].getDisplayMessageBody();

                    Toast toast = Toast.makeText(context, "Sender Number: " + phoneNumber +", Message: " + message, Toast.LENGTH_LONG);
                    toast.show();

                    Log.i("SMS Number", phoneNumber);
                    Log.i("SMS Message", message);
                }
            } catch(Exception e) {
                Log.d("Exception - SmsListener", e.getMessage());
            }
        }
    }
}
