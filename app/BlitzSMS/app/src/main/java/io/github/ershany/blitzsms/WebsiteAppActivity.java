package io.github.ershany.blitzsms;

/**
 * Created by Brady on 10/15/2017.
 */

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.telephony.SmsManager;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

public class WebsiteAppActivity extends Activity {

    private final SmsManager smsManager = SmsManager.getDefault();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.website_app_activity);

        Button b = findViewById(R.id.websiteButton);
        b.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                EditText websiteText = (EditText) findViewById(R.id.websiteEditText);
                String searchString = websiteText.getText().toString().trim();
                websiteText.setText("");

                // Hide the keyboard
                InputMethodManager imm = (InputMethodManager) getApplicationContext().getSystemService(Context.INPUT_METHOD_SERVICE);
                imm.hideSoftInputFromWindow(v.getWindowToken(), 0);

                // Send the SMS if the user entered a message
                if(searchString == null || searchString.isEmpty()) return;

                // Later will want to change the last two parameters to a value so we can tell if the sms was sent and received. Thus we can update the frontend
                smsManager.sendTextMessage(getResources().getString(R.string.server_phonenumber), null, searchString, null, null);

                // Prepare the UI for the website fetch
                TextView websiteTitleView = (TextView) findViewById(R.id.websiteTitle);
                websiteTitleView.setText(searchString);
                TextView websiteTextView = (TextView) findViewById(R.id.websiteText);
                websiteTextView.setText("Loading...");
            }
        });
    }

    public void updateWebsiteText(final String text) {
        runOnUiThread(new Runnable() {
            public void run() {
                TextView websiteTextView = (TextView)findViewById(R.id.websiteText);
                websiteTextView.setText(text);
            }
        });
    }

}
