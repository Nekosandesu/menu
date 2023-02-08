import { InputNumber, Select } from 'antd';
import React, { Dispatch, SetStateAction } from 'react';
import { MEAL_CATEGORY } from '../App';

interface Step1Props {
  mealCategory: MEAL_CATEGORY | undefined;
  peopleNumber: number;
  setMealCategory: Dispatch<SetStateAction<MEAL_CATEGORY | undefined>>;
  setPeopleNumber: Dispatch<SetStateAction<number>>;
}

export default function Step1({
  mealCategory,
  peopleNumber,
  setMealCategory,
  setPeopleNumber,
}: Step1Props) {
  return (
    <>
      <div className="form-item">
        <div className="label">Please Select a meal</div>
        <Select
          value={mealCategory}
          style={{ width: 220 }}
          onChange={setMealCategory}
          options={[
            {
              label: MEAL_CATEGORY.breakfast,
              value: MEAL_CATEGORY.breakfast,
            },
            { label: MEAL_CATEGORY.lunch, value: MEAL_CATEGORY.lunch },
            { label: MEAL_CATEGORY.dinner, value: MEAL_CATEGORY.dinner },
          ]}
        />
      </div>

      <div className="form-item">
        <div className="label">Please Enter Number of people</div>
        <InputNumber
          min={1}
          max={10}
          value={peopleNumber}
          // @ts-ignore can't be null
          onChange={setPeopleNumber}
        />
      </div>
    </>
  );
}
