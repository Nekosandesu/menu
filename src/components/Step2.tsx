import { Select } from 'antd';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { find } from 'lodash-es';

interface Step2Props {
  selectedRestaurant?: string;
  restaurants: { label: string; value: string }[];
  setSelectedRestaurant: Dispatch<SetStateAction<string | undefined>>;
}
export default function Step2({
  selectedRestaurant,
  restaurants,
  setSelectedRestaurant,
}: Step2Props) {
  useEffect(() => {
    // when step1 changed, check if selectedRestaurant still in restaurants,
    // if not, reset it
    const one = find(restaurants, ['value', selectedRestaurant]);
    if (!one) {
      setSelectedRestaurant(undefined);
    }
  }, []);

  return (
    <div className="form-item">
      <div className="label">Please Select a Restaurant</div>
      <Select
        value={selectedRestaurant}
        style={{ width: 220 }}
        onChange={setSelectedRestaurant}
        options={restaurants}
      />
    </div>
  );
}
