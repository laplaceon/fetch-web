import MultiText from "./MultiText";
import {Slider, Form} from "@heroui/react";

const FilterPanel = ({ breeds, minAge, maxAge }) => {

    return <Form>
                <Slider
                    defaultValue={[minAge, maxAge]}
                    label="Age Range"
                    maxValue={maxAge}
                    minValue={minAge}
                    step={1}
                />
                <MultiText />
            </Form>;

};

export default FilterPanel;