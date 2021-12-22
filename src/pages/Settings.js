import {Button, Form} from "react-bootstrap";
import {useQuery} from "@apollo/client";
import {GET_SETTINGS} from "../helpers/gqlQueries";
import Banner from "../components/Banner";

const Settings = () => {

    const {data, loading, error} = useQuery(GET_SETTINGS);

    return (
        <>
            <Banner title={'Ustawienia'}/>
        <div className={'container'}>
            <Form>
                <Form.Select className={'w-25'}>
                    <option value="1">Manual</option>
                    <option value="2">Plan</option>
                </Form.Select>
                <Form.Select className={'w-25'}>
                    <option value="1">1</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="30">30</option>
                    <option value="60">60</option>
                    <option value="120">120</option>
                </Form.Select>
                {
                    data &&
                    <>
                        <Form.Check
                            type="switch"
                            checked={data.settings[0].pump}
                            label="Dozowanie wody"
                        />
                        <Form.Check
                            type="switch"
                            checked={data.settings[0].pump_fertilizer}
                            label="Dozowanie nawozu"
                        />
                        <Form.Check
                            type="switch"
                            checked={data.settings[0].light}
                            label="Oświetlenie"
                        />
                        <Form.Check
                            type="switch"
                            checked={data.settings[0].fan}
                            label="Wentylacja"
                        />
                    </>
                }
                <Button type="submit" className={'w-25'}>Zapisz</Button>
            </Form>
        </div>
        </>
    )
}

export default Settings;
