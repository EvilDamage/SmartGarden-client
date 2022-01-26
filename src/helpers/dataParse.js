import moment from 'moment'

export const formatDateForDisplay = (date) => {
    if(!isNaN(new Date(date).getTime())){
        return moment(date).format('DD.MM.YYYY HH:mm:ss')
        // return new Intl.DateTimeFormat('pl-PL', {timeStyle: "medium", dateStyle: "short"}).format(new Date(date));
    }
}

export const formatDateForFileName = (date) => {
    if(!isNaN(new Date(date).getTime())){
        return moment(date).format('DD.MM.YYYY_HH:mm:ss')
        // return new Intl.DateTimeFormat('pl-PL', {timeStyle: "medium", dateStyle: "short"}).format(new Date(date));
    }
}

export const customDatePicker = (days) => {
    if(!isNaN(days)){
        var date = new Date();
        return date.setDate(date.getDate() - days);
    }
}

export const calculateDaysBetween = (startDate, endDate) => {
   return moment(startDate).diff(moment(endDate), 'days')
}
