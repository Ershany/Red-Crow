package io.github.ershany.blitzsms.utils;

/**
 * Created by Brady on 11/20/2017.
 */

import android.content.Context;
import android.content.res.Resources;
import android.telephony.SmsManager;
import android.util.Log;

import io.github.ershany.blitzsms.R;

public class SmsSend {

    private static final SmsSend singleton = new SmsSend();

    private static final SmsManager smsManager = SmsManager.getDefault();
    private static Context context;

    private SmsSend() {}

    public static SmsSend getInstance(Context context) {
        SmsSend.context = context;
        return singleton;
    }



    public void SendToServer(String message) {
        // Later will want to change the last two parameters to a value so we can tell if the sms was sent and received. Thus we can update the frontend
        smsManager.sendTextMessage(context.getString(R.string.server_phonenumber), null, encrypt(message), null, null);
    }

    private String encrypt(String message) {
        if(context.getResources().getBoolean(R.bool.encrypted)) {
            Log.i("Encrypting MSG", message);

            Log.i("Encrypted MSG" , message);
            return message;
        }
        else {
            return message;
        }
    }

}
