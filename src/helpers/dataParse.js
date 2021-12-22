import moment from 'moment'

export const formatDateForDisplay = (date) => {
    if(!isNaN(new Date(date).getTime())){
        return moment(date).format('DD.MM.YY HH:mm:ss')
        // return new Intl.DateTimeFormat('pl-PL', {timeStyle: "medium", dateStyle: "short"}).format(new Date(date));
    }
}
