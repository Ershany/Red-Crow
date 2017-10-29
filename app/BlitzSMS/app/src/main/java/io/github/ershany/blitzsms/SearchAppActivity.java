package io.github.ershany.blitzsms;

/**
 * Created by Brady on 10/14/2017.
 */

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.telephony.SmsManager;
import android.util.Log;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;

public class SearchAppActivity extends Activity {

    private final SmsManager smsManager = SmsManager.getDefault();
    private SmsListener listener;

    private final int numSearches = 3;
    private TextView[] textViews;

    private boolean loadingComplete;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.search_app_activity);
        loadingComplete = false;

        // Store the pointers to all of the textviews
        textViews = new TextView[numSearches * 3];
        TextView title1 = (TextView) findViewById(R.id.titleTextView1);     textViews[0] = title1;
        TextView title2 = (TextView) findViewById(R.id.titleTextView2);     textViews[3] = title2;
        TextView title3 = (TextView) findViewById(R.id.titleTextView3);     textViews[6] = title3;
        TextView url1 = (TextView) findViewById(R.id.urlTextView1);         textViews[1] = url1;
        TextView url2 = (TextView) findViewById(R.id.urlTextView2);         textViews[4] = url2;
        TextView url3 = (TextView) findViewById(R.id.urlTextView3);         textViews[7] = url3;
        TextView desc1 = (TextView) findViewById(R.id.descTextView1);       textViews[2] = desc1;
        TextView desc2 = (TextView) findViewById(R.id.descTextView2);       textViews[5] = desc2;
        TextView desc3 = (TextView) findViewById(R.id.descTextView3);       textViews[8] = desc3;

        // SMS Received Listener
        listener = new SmsListener() {
            @Override
            public void onSMS(String message) {
                // Message Format:
                // Error Code / Type Byte / Message ID Byte
                if(message.charAt(0) != '0') {
                    Log.e("Error Code", Character.toString(message.charAt(0)));
                    return;
                }
                if(message.charAt(1) != '0') {
                    Log.e("Wrong AppType", Character.toString(message.charAt(1)));
                    return;
                }

                // Parse the important information and add it to the textviews
                String[] searchPayload = message.substring(3).split("\n");
                for(int i = 0; i < textViews.length; ++i) {
                    if(i >= searchPayload.length) break;

                    Log.i("SearchParse", searchPayload[i]);
                    textViews[i].setText(searchPayload[i]);
                }

                loadingComplete = true;
            }
        };
        IntentFilter intentFilter = new IntentFilter("android.provider.Telephony.SMS_RECEIVED");
        intentFilter.setPriority(999);
        this.registerReceiver(listener, intentFilter);

        // Button listener
        final Button b = findViewById(R.id.searchButton);
        b.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                EditText searchText = (EditText) findViewById(R.id.searchEditText);
                String searchString = searchText.getText().toString().trim();
                searchText.setText("");

                // Hide the keyboard
                InputMethodManager imm = (InputMethodManager) getApplicationContext().getSystemService(Context.INPUT_METHOD_SERVICE);
                imm.hideSoftInputFromWindow(v.getWindowToken(), 0);

                // Send the SMS if the user entered a message
                if(searchString == null || searchString.isEmpty()) return;

                // Build the message for the server
                int messageId = 0;
                String message = "E0" + messageId + searchString;

                // Later will want to change the last two parameters to a value so we can tell if the sms was sent and received. Thus we can update the frontend
                smsManager.sendTextMessage(getResources().getString(R.string.server_phonenumber), null, message, null, null);

                // Prepare the UI for a search
                textViews[0].setText("Loading");
                textViews[3].setText("Loading");
                textViews[6].setText("Loading");

                Log.i("SearchSent", "Search sent: " + message);
            }
        });

        // Setup click listeners for each search option
        LinearLayout layout1 = (LinearLayout) findViewById(R.id.searchLayout1);
        LinearLayout layout2 = (LinearLayout) findViewById(R.id.searchLayout2);
        LinearLayout layout3 = (LinearLayout) findViewById(R.id.searchLayout3);

        layout1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(loadingComplete) {
                    Intent intent = new Intent();
                    intent.putExtra("searchURL", textViews[1].getText());
                    setResult(RESULT_OK, intent);
                    finish();
                }
            }
        });
        layout2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(loadingComplete) {
                    Intent intent = new Intent();
                    intent.putExtra("searchURL", textViews[4].getText());
                    setResult(RESULT_OK, intent);
                    finish();
                }
            }
        });
        layout3.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(loadingComplete) {
                    Intent intent = new Intent();
                    intent.putExtra("searchURL", textViews[7].getText());
                    setResult(RESULT_OK, intent);
                    finish();
                }
            }
        });
    }

}
