package io.github.ershany.redcrow;

import android.content.Context;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.telephony.SmsManager;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;

public class MainActivity extends AppCompatActivity {

    private SmsManager smsManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        smsManager = SmsManager.getDefault();
    }

    public void searchButtonOnClick(View v) {
        EditText searchText = (EditText) findViewById(R.id.searchEditText);

        // Later will want to change the last two parameters to a value so we can tell if the sms was sent and received. Thus we can update the frontend
        smsManager.sendTextMessage("6136330139", null, searchText.getText().toString(), null, null);

        searchText.setText("");

        // Hide the keyboard
        InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
        imm.hideSoftInputFromWindow(v.getWindowToken(), 0);
    }

}
