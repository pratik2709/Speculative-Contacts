var utils = {
    flipContacts: function(contacts){

        for(var ii = 0; ii < contacts.length; ii++){

            var tempMB = contacts[ii].mB;
            contacts[ii].mB = contacts[ii].mA;
            contacts[ii].mA = tempMB;

            var tempMPb = contacts[ii].mPb;
            contacts[ii].mPb = contacts[ii].mPa;
            contacts[ii].mPa = tempMPb;

            contacts[ii].mNormal.x *= -1;
            contacts[ii].mNormal.y *= -1;
        }

    }
};
