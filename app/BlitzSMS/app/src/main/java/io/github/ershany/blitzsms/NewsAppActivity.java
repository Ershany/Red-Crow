package io.github.ershany.blitzsms;

import android.app.Activity;
import android.content.IntentFilter;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.Spinner;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import io.github.ershany.blitzsms.utils.OnSMS;
import io.github.ershany.blitzsms.utils.SmsListener;
import io.github.ershany.blitzsms.utils.SmsSend;

/**
 * Created by Brady on 10/15/2017.
 */

public class NewsAppActivity extends Activity {

    private SmsListener listener;
    private SmsSend smsSend;

    private final long buttonMSTimeout = 2500;
    private final int numNews = 8;
    private TextView[] textViews;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.news_app_activity);
        smsSend = SmsSend.getInstance(this);

        // Populate spinner
        List<String> spinnerData = new ArrayList<String>();
        spinnerData.add("WorldNews");
        spinnerData.add("Canada");
        spinnerData.add("Games");
        spinnerData.add("GamerNews");
        spinnerData.add("TodayILearned");

        ArrayAdapter<String> adapter = new ArrayAdapter<String>(this, android.R.layout.simple_spinner_item, spinnerData);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        Spinner subreddits = (Spinner) findViewById(R.id.newsSpinner);
        subreddits.setAdapter(adapter);

        // Store the pointers to all of the textviews
        textViews = new TextView[numNews];
        textViews[0] = (TextView) findViewById(R.id.newsTitle1);
        textViews[1] = (TextView) findViewById(R.id.newsTitle2);
        textViews[2] = (TextView) findViewById(R.id.newsTitle3);
        textViews[3] = (TextView) findViewById(R.id.newsTitle4);
        textViews[4] = (TextView) findViewById(R.id.newsTitle5);
        textViews[5] = (TextView) findViewById(R.id.newsTitle6);
        textViews[6] = (TextView) findViewById(R.id.newsTitle7);
        textViews[7] = (TextView) findViewById(R.id.newsTitle8);


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
                // Get the news that the user selected
                String name = ((Spinner) findViewById(R.id.newsSpinner)).getSelectedItem().toString();

                // Build the message for the server
                int messageId = 0;
                String message = "E2" + messageId + name;

                smsSend.SendToServer(message);

                // Prepare the UI for news
                TextView dateText = (TextView) findViewById(R.id.dateTextView);
                dateText.setText("Loading");

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
