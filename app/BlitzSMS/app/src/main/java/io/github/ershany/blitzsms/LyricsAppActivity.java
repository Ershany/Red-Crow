package io.github.ershany.blitzsms;

/**
 * Created by Brady on 2017-11-20.
 */

import android.app.Activity;
import android.content.Context;
import android.content.IntentFilter;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import io.github.ershany.blitzsms.utils.OnSMS;
import io.github.ershany.blitzsms.utils.SmsListener;
import io.github.ershany.blitzsms.utils.SmsSend;

public class LyricsAppActivity extends Activity {

    private SmsListener listener;
    private SmsSend smsSend;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.lyrics_app_activity);
        smsSend = SmsSend.getInstance(this);

        // SMS Received Listener
        OnSMS handle = new OnSMS() {
            public void onSMS(String message) {
                // Message Format:
                // Error Code / Type Byte / Message ID Byte
                if (message.charAt(0) != '0') {
                    Log.e("Error Code", Character.toString(message.charAt(0)));
                    return;
                }
                if (message.charAt(1) != '3') {
                    Log.e("Wrong AppType", Character.toString(message.charAt(1)));
                    return;
                }

                // Parse the lyrics into the textview
                Log.i("Lyrics Fetch", message);
                String lyricsText = message.substring(3);

                TextView lyricView = (TextView) findViewById(R.id.songLyricView);
                lyricView.setText(lyricsText);
            }
        };
        listener = SmsListener.getInstance(handle);
        IntentFilter intentFilter = new IntentFilter("android.provider.Telephony.SMS_RECEIVED");
        intentFilter.setPriority(999);
        this.registerReceiver(listener, intentFilter);

        // Button listener
        final Button b = findViewById(R.id.lyricsButton);
        b.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                TextView lyricView = (TextView) findViewById(R.id.songLyricView);
                EditText songName = (EditText) findViewById(R.id.nameText);
                EditText songArtist = (EditText) findViewById(R.id.artistText);

                // Hide the keyboard
                InputMethodManager imm = (InputMethodManager) getApplicationContext().getSystemService(Context.INPUT_METHOD_SERVICE);
                imm.hideSoftInputFromWindow(v.getWindowToken(), 0);

                String songNameStr = songName.getText().toString().trim();
                String songArtistStr = songArtist.getText().toString().trim();
                songName.setText("");
                songArtist.setText("");

                // Ensure input was given
                if (songNameStr.isEmpty() || songArtistStr.isEmpty()) {
                    lyricView.setText("Please enter the song's name and artist");
                    return;
                }

                // Build the message for the server
                int messageId = 0;
                String message = "E3" + messageId + songArtistStr + "/" + songNameStr;

                smsSend.SendToServer(message);
                Log.i("Lyric Req", "Lyric Req Sent: " + message);

                // Prepare the UI for a search
                lyricView.setText("Loading");

                // Display the lyric request
                TextView songTitleView = (TextView) findViewById(R.id.songTitle);
                songTitleView.setText(songArtistStr + ": " + songNameStr);
            }
        });
    }
}