package io.github.ershany.blitzsms;

/**
 * Created by Brady on 10/15/2017.
 */

import android.app.Activity;
import android.content.Context;
import android.content.IntentFilter;
import android.os.Bundle;
import android.telephony.SmsManager;
import android.util.Log;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import io.github.ershany.blitzsms.utils.OnSMS;
import io.github.ershany.blitzsms.utils.SmsListener;

public class WebsiteAppActivity extends Activity {

    private final SmsManager smsManager = SmsManager.getDefault();
    private SmsListener listener;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.website_app_activity);

        // Button listener
        Button button = findViewById(R.id.websiteButton);
        button.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                EditText websiteText = findViewById(R.id.websiteEditText);
                String searchString = websiteText.getText().toString().trim();
                websiteText.setText("");

                // Hide the keyboard
                InputMethodManager imm = (InputMethodManager) getApplicationContext().getSystemService(Context.INPUT_METHOD_SERVICE);
                imm.hideSoftInputFromWindow(v.getWindowToken(), 0);

                // Send the SMS if the user entered a message
                if(searchString.isEmpty()) return;

                // Build the message for the server
                int messageId = 0;
                String message = "E1" + messageId + searchString;

                // Later will want to change the last two parameters to a value so we can tell if the sms was sent and received. Thus we can update the frontend
                smsManager.sendTextMessage(getResources().getString(R.string.server_phonenumber), null, message, null, null);

                // Prepare the UI for the website fetch
                TextView websiteTitleView = (TextView) findViewById(R.id.websiteTitle);
                websiteTitleView.setText(searchString);
                updateWebsiteText("Loading...");

                Log.i("WebsiteSent", message);
            }
        });

        // Get data from parent activity if it was supplied
        if(getIntent().getExtras() != null) {
            String urlFromParent = (getIntent().getExtras().get("searchURL") != null) ? getIntent().getExtras().get("searchURL").toString() : "";
            if(!urlFromParent.isEmpty()) {
                // Put the url in the EditText and then simulate a button click
                EditText websiteText = findViewById(R.id.websiteEditText);
                websiteText.setText(urlFromParent);

                button.performClick();
                Log.i("URLReceived", "URL Received From Search: " + urlFromParent);
            }
        }

        // SMS Received Listener
        OnSMS handle = new OnSMS() {
            public void onSMS(String message) {
                // Message Format:
                // Error Code / Type Byte / Message ID Byte
                if(message.charAt(0) != '0') {
                    Log.e("Error Code", Character.toString(message.charAt(0)));
                    return;
                }
                if(message.charAt(1) != '1') {
                    Log.e("Wrong AppType", Character.toString(message.charAt(1)));
                    return;
                }

                Log.i("Website Fetch", message);
                String websiteText = message.substring(3);

                updateWebsiteText(websiteText);
            }
        };
        listener = SmsListener.getInstance(handle);
        IntentFilter intentFilter = new IntentFilter("android.provider.Telephony.SMS_RECEIVED");
        intentFilter.setPriority(999);
        this.registerReceiver(listener, intentFilter);
    }

    public void updateWebsiteText(final String text) {
        runOnUiThread(new Runnable() {
            public void run() {
                TextView websiteTextView = findViewById(R.id.websiteText);
                websiteTextView.setText(text);
            }
        });
    }

}
