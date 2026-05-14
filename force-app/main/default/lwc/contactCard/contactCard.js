import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';

// Contact fields to retrieve
const FIELDS = [
    'Contact.Name',
    'Contact.Title',
    'Contact.Email',
    'Contact.Phone',
    'Contact.MobilePhone',
    'Contact.MailingStreet',
    'Contact.MailingCity',
    'Contact.MailingState',
    'Contact.MailingPostalCode',
    'Contact.MailingCountry',
    'Contact.Account.Name',
    'Contact.PhotoUrl'
];

export default class ContactCard extends NavigationMixin(LightningElement) {
    @api recordId;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    contact;

    get hasPhoto() {
        return this.contact.data && getFieldValue(this.contact.data, 'Contact.PhotoUrl');
    }

    get photoUrl() {
        return getFieldValue(this.contact.data, 'Contact.PhotoUrl');
    }

    get initials() {
        if (!this.contact.data) return '';
        const name = getFieldValue(this.contact.data, 'Contact.Name');
        if (!name) return '';
        
        const nameParts = name.trim().split(' ');
        if (nameParts.length === 1) {
            return nameParts[0].charAt(0).toUpperCase();
        }
        return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
    }

    get accountName() {
        return this.contact.data ? getFieldValue(this.contact.data, 'Contact.Account.Name') : null;
    }

    get phoneNumber() {
        if (!this.contact.data) return null;
        
        const mobile = getFieldValue(this.contact.data, 'Contact.MobilePhone');
        const phone = getFieldValue(this.contact.data, 'Contact.Phone');
        
        return mobile || phone || null;
    }

    get mailingAddress() {
        if (!this.contact.data) return null;

        const street = getFieldValue(this.contact.data, 'Contact.MailingStreet');
        const city = getFieldValue(this.contact.data, 'Contact.MailingCity');
        const state = getFieldValue(this.contact.data, 'Contact.MailingState');
        const postalCode = getFieldValue(this.contact.data, 'Contact.MailingPostalCode');
        const country = getFieldValue(this.contact.data, 'Contact.MailingCountry');

        const addressParts = [];
        
        if (street) addressParts.push(street);
        
        const cityStateZip = [];
        if (city) cityStateZip.push(city);
        if (state) cityStateZip.push(state);
        if (postalCode) cityStateZip.push(postalCode);
        
        if (cityStateZip.length > 0) {
            addressParts.push(cityStateZip.join(', '));
        }
        
        if (country) addressParts.push(country);

        return addressParts.length > 0 ? addressParts.join('\n') : null;
    }

    handleCardClick() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.recordId,
                objectApiName: 'Contact',
                actionName: 'view'
            }
        });
    }
}