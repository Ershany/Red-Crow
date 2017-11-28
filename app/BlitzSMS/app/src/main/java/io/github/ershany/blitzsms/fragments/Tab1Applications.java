package io.github.ershany.blitzsms.fragments;

/**
 * Created by Brady on 10/2/2017.
 */

import android.content.Intent;
import android.support.v4.app.Fragment;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;

import io.github.ershany.blitzsms.MainActivity;
import io.github.ershany.blitzsms.LyricsAppActivity;
import io.github.ershany.blitzsms.MapsAppActivity;
import io.github.ershany.blitzsms.NewsAppActivity;
import io.github.ershany.blitzsms.R;
import io.github.ershany.blitzsms.SearchAppActivity;
import io.github.ershany.blitzsms.WebsiteAppActivity;

import static android.app.Activity.RESULT_OK;

public class Tab1Applications extends Fragment {

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        final View rootView = inflater.inflate(R.layout.tab1applications, container, false);

        ImageButton bSearch = rootView.findViewById(R.id.searchAppButton);
        bSearch.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Intent i = new Intent(getContext(), SearchAppActivity.class);
                startActivityForResult(i, 1); // Request code is 1
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

        ImageButton bLyrics = rootView.findViewById(R.id.lyricsAppButton);
        bLyrics.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Intent i = new Intent(getContext(), LyricsAppActivity.class);
                startActivity(i);
            }
        });

        return rootView;
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        // Check if an URL was returned from the search
        if(requestCode == 1) {
            if(resultCode == RESULT_OK) {
                Log.i("URL Received", data.getStringExtra("searchURL"));
                Intent i = new Intent(getContext(), WebsiteAppActivity.class);
                i.putExtra("searchURL", data.getStringExtra("searchURL"));

                ((MainActivity) getActivity()).addHistory(data.getStringExtra("searchURL"));

                startActivity(i);
            }
        }
    }

}
