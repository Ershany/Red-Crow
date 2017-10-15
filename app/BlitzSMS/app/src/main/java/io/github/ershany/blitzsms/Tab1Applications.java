package io.github.ershany.blitzsms;

/**
 * Created by Brady on 10/2/2017.
 */

import android.content.Intent;
import android.support.v4.app.Fragment;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;

public class Tab1Applications extends Fragment {

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        final View rootView = inflater.inflate(R.layout.tab1applications, container, false);

        ImageButton bSearch = rootView.findViewById(R.id.searchAppButton);
        bSearch.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Intent i = new Intent(getContext(), SearchAppActivity.class);
                startActivity(i);
            }
        });

        ImageButton bMaps = rootView.findViewById(R.id.mapsAppButton);
        bMaps.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Intent i = new Intent(getContext(), MapsAppActivity.class);
                startActivity(i);
            }
        });

        ImageButton bNews = rootView.findViewById(R.id.newsAppButton);
        bNews.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Intent i = new Intent(getContext(), NewsAppActivity.class);
                startActivity(i);
            }
        });

        ImageButton bWebsite = rootView.findViewById(R.id.websiteAppButton);
        bWebsite.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Intent i = new Intent(getContext(), WebsiteAppActivity.class);
                startActivity(i);
            }
        });

        return rootView;
    }

}
