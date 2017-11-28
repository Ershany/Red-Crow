package io.github.ershany.blitzsms.fragments;

/**
 * Created by Brady on 10/2/2017.
 */

import android.os.Bundle;
import android.support.design.widget.AppBarLayout;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.Spinner;
import android.widget.TextView;


import io.github.ershany.blitzsms.MainActivity;
import io.github.ershany.blitzsms.R;
import io.github.ershany.blitzsms.utils.ItemSelectListener;

public class Tab3Settings extends Fragment {

    private Spinner spinner1;
    private Button btnSubmit;
    private TextView text;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.tab3settings, container, false);

        text = (TextView) rootView.findViewById(R.id.section_label);

        spinner1 = (Spinner) rootView.findViewById(R.id.spinner1);

        spinner1.setOnItemSelectedListener(new ItemSelectListener());

        btnSubmit = (Button) rootView.findViewById(R.id.btnSubmit);

        btnSubmit.setOnClickListener(new OnClickListener() {

            @Override
            public void onClick(View v) {

                if(String.valueOf(spinner1.getSelectedItem()).equals("Red")){
                    ((MainActivity) getActivity()).changecolor(0xFF9F303F);


                }

                else if(String.valueOf(spinner1.getSelectedItem()).equals("Green")){
                    ((MainActivity) getActivity()).changecolor(0xFF00933f);


                }

                else if(String.valueOf(spinner1.getSelectedItem()).equals("Blue")){
                    ((MainActivity) getActivity()).changecolor(0xFF0000FF);


                }


            }

        });




        return rootView;
    }
}


