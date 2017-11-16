package io.github.ershany.blitzsms.utils;

/**
 * Created by Brady on 11/15/2017.
 *
 * This class is used to make an SMS handler, for when the phone receives SMS
 * Each class can instantiate this interface and define how they want the SMS to be handled
 * They can then pass this to the SMS receiver so it will behave properly
 *
 */

public interface OnSMS {
    public abstract void onSMS(String message);
}
