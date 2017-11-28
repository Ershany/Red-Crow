package io.github.ershany.blitzsms.fragments;

/**
 * Created by Brady on 10/2/2017.
 */

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

import io.github.ershany.blitzsms.MainActivity;
import io.github.ershany.blitzsms.R;
import io.github.ershany.blitzsms.WebsiteAppActivity;

public class Tab2History extends Fragment {
    TextView text, url1, url2, url3;
    String[] history;
    LinearLayout layout1, layout2,layout3;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.tab2history, container, false);

        history = ((MainActivity) getActivity()).getHistory();

        text = (TextView) rootView.findViewById(R.id.historyText);


        url1= (TextView) rootView.findViewById(R.id.urlTextView1);
        url2= (TextView) rootView.findViewById(R.id.urlTextView2);
        url3= (TextView) rootView.findViewById(R.id.urlTextView3);

        // Setup click listeners for each search option
        layout1 = (LinearLayout) rootView.findViewById(R.id.searchLayout1);
        layout2 = (LinearLayout) rootView.findViewById(R.id.searchLayout2);
        layout3 = (LinearLayout) rootView.findViewById(R.id.searchLayout3);

        layout1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                if(history[0] != null) {
                    Intent intent = new Intent();
                    intent.putExtra("searchURL", history[0]);
                    Log.i("Sending URL", history[0]);

                    Intent i = new Intent(getContext(), WebsiteAppActivity.class);
                    i.putExtra("searchURL",url1.getText().toString());
                    startActivity(i);
                }
            }
        });
        layout2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(history[1] != null) {
                    Intent intent = new Intent();
                    intent.putExtra("searchURL", history[1]);
                    Log.i("Sending URL", history[1]);

                    Intent i = new Intent(getContext(), WebsiteAppActivity.class);
                    i.putExtra("searchURL",url2.getText().toString());
                    startActivity(i);

                }
            }
        });
        layout3.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(history[2] != null) {
                    Intent intent = new Intent();
                    intent.putExtra("searchURL", history[2]);
                    Log.i("Sending URL", history[2]);

                    Intent i = new Intent(getContext(), WebsiteAppActivity.class);
                    i.putExtra("searchURL",url3.getText().toString());
                    startActivity(i);


                }
            }
        });


        Button refresh = (Button) rootView.findViewById(R.id.refresh);

        refresh.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View v) {

                history = ((MainActivity) getActivity()).getHistory();

                url1.setText(history[0]);
                url2.setText(history[1]);
                url3.setText(history[2]);


            }

        });


        return rootView;
    }


}
