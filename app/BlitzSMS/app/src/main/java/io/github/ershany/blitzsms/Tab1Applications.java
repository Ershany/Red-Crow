package io.github.ershany.blitzsms;

/**
 * Created by Brady on 10/2/2017.
 */

import android.content.Context;
import android.support.v4.app.Fragment;
import android.os.Bundle;
import android.telephony.SmsManager;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;

public class Tab1Applications extends Fragment {

    private final SmsManager smsManager = SmsManager.getDefault();

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        final View rootView = inflater.inflate(R.layout.tab1applications, container, false);

        Button b = rootView.findViewById(R.id.searchButton);
        b.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                EditText searchText = (EditText) rootView.findViewById(R.id.searchEditText);
                String searchString = searchText.getText().toString().trim();
                searchText.setText("");

                // Hide the keyboard
                InputMethodManager imm = (InputMethodManager) getActivity().getSystemService(Context.INPUT_METHOD_SERVICE);
                imm.hideSoftInputFromWindow(v.getWindowToken(), 0);

                // Send the SMS if the user entered a message
                if(searchString == null || searchString.isEmpty()) return;

                // Later will want to change the last two parameters to a value so we can tell if the sms was sent and received. Thus we can update the frontend
                smsManager.sendTextMessage(getResources().getString(R.string.server_phonenumber), null, searchString, null, null);
            }
        });

        return rootView;
    }

}
