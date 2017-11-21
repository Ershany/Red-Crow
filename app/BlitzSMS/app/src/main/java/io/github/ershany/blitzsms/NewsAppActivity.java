package io.github.ershany.blitzsms;

import android.app.Activity;
import android.content.IntentFilter;
import android.os.Bundle;
import android.telephony.SmsManager;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import java.util.Calendar;

import io.github.ershany.blitzsms.utils.OnSMS;
import io.github.ershany.blitzsms.utils.SmsListener;

/**
 * Created by Brady on 10/15/2017.
 */

public class NewsAppActivity extends Activity {

    private final SmsManager smsManager = SmsManager.getDefault();
    private SmsListener listener;

    private final long buttonMSTimeout = 2500;
    private final int numSearches = 3;
    private final int numViewsPerSearch = 2;
    private TextView[] textViews;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.news_app_activity);

        // Store the pointers to all of the textviews
        textViews = new TextView[numSearches * numViewsPerSearch];
        textViews[0] = (TextView) findViewById(R.id.titleTextView1);
        textViews[2] = (TextView) findViewById(R.id.titleTextView2);
        textViews[4] = (TextView) findViewById(R.id.titleTextView3);
        textViews[1] = (TextView) findViewById(R.id.descTextView1);
        textViews[3] = (TextView) findViewById(R.id.descTextView2);
        textViews[5] = (TextView) findViewById(R.id.descTextView3);

        // SMS Received Listener
        OnSMS handle = new OnSMS() {
            public void onSMS(String message) {
                // Message Format:
                // Error Code / Type Byte / Message ID Byte
                if(message.charAt(0) != '0') {
                    Log.e("Error Code", Character.toString(message.charAt(0)));
                    return;
                }
                if(message.charAt(1) != '2') {
                    Log.e("Wrong AppType", Character.toString(message.charAt(1)));
                    return;
                }

                // Parse the important information and add it to the textviews
                String[] searchPayload = message.substring(3).split("\n");
                for(int i = 0; i < textViews.length; ++i) {
                    if(i >= searchPayload.length) break;

                    Log.i("NewsParse", searchPayload[i]);
                    textViews[i].setText(searchPayload[i]);
                }

                // Log the date this news was received
                TextView dateText = (TextView) findViewById(R.id.dateTextView);
                dateText.setText("Date & Time of News: " + Calendar.getInstance().getTime().toString());
                Log.i("LoggingDate", Calendar.getInstance().getTime().toString());
            }
        };
        listener = SmsListener.getInstance(handle);
        IntentFilter intentFilter = new IntentFilter("android.provider.Telephony.SMS_RECEIVED");
        intentFilter.setPriority(999);
        this.registerReceiver(listener, intentFilter);

        // Button listener
        final Button b = findViewById(R.id.newsButton);
        b.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                // Build the message for the server
                int messageId = 0;
                String message = "E2" + messageId;

                // Later will want to change the last two parameters to a value so we can tell if the sms was sent and received. Thus we can update the frontend
                smsManager.sendTextMessage(getResources().getString(R.string.server_phonenumber), null, message, null, null);

                // Prepare the UI for news
                textViews[0].setText("Loading");
                textViews[2].setText("Loading");
                textViews[4].setText("Loading");

                Log.i("SearchSent", "Search sent: " + message);

                // Disable the button for a brief time
                final Button button = (Button) findViewById(R.id.newsButton);
                button.setEnabled(false);
                new Thread(new Runnable() {

                    @Override
                    public void run() {
                        try {
                            Thread.sleep(buttonMSTimeout);
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }

                        runOnUiThread(new Runnable() {

                            @Override
                            public void run() {
                                button.setEnabled(true);
                            }
                        });
                    }
                }).start();
            }
        });
    }

}
