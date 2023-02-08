import { Button, InputNumber, Select } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { nanoid } from 'nanoid';
import { find, findIndex } from 'lodash-es';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { Dish } from '../App';

interface DishOption {
  label?: string;
  value: number | string;
  disabled?: boolean;
}

interface Step3Props {
  allDishes: Dish[];
  selectedDishes: Dish[];
  peopleNumber: number;
  setSelectedDishes: Dispatch<SetStateAction<Array<Dish>>>;
  setFormError: Dispatch<SetStateAction<boolean>>;
  selectedRestaurant?: string;
  data: Record<string, any>;
}

export default function Step3({
  allDishes,
  selectedDishes,
  setSelectedDishes,
  peopleNumber,
  setFormError,
  selectedRestaurant,
  data,
}: Step3Props) {
  const [dishOptions, setDishOptions] = useState<Array<DishOption>>([]);

  // when step2 changed, reset selectedDishes,`
  useEffect(() => {
    if (selectedDishes.length) {
      const one = find(data.dishes, ['id', selectedDishes[0].id]);
      if (one && one.restaurant !== selectedRestaurant) {
        setSelectedDishes([]);
      }
    }
  }, []);

  useEffect(() => {
    const selectIds = selectedDishes.map((i) => i.id);
    setDishOptions(
      allDishes.map(({ id, name }) => ({
        label: name,
        value: id,
        disabled: selectIds.includes(id),
      }))
    );
  }, [allDishes]);

  const totalNumber = useMemo(() => {
    return selectedDishes.reduce((acc, { count }) => acc + (count || 0), 0);
  }, [selectedDishes]);

  const errorMessage = useMemo(() => {
    if (!selectedDishes.length) return '';
    if (totalNumber < peopleNumber) {
      return 'The total number of dishes should be greater or equal \n to the number of people.';
    }
    if (totalNumber > 10) {
      return "The total number of dishes shouldn't be greater than 10.";
    }
    return '';
  }, [selectedDishes.length, totalNumber, peopleNumber]);

  useEffect(() => {
    setFormError(!!errorMessage);
  }, [errorMessage]);

  const addDishes = () => {
    setSelectedDishes((pre) => [...pre, { id: nanoid(), count: 1 }]);
  };

  const deleteDish = (item: Dish) => {
    const { id } = item;

    setSelectedDishes((pre) => {
      const index = findIndex(pre, ['id', id]);
      return [...pre.slice(0, index), ...pre.slice(index + 1)];
    });

    // enable the dish in the options
    const dishIndex = findIndex(dishOptions, ['value', id]);
    if (dishIndex > -1) {
      setDishOptions((pre) => [
        ...pre.slice(0, dishIndex),
        {
          ...dishOptions[dishIndex],
          disabled: false,
        },
        ...pre.slice(dishIndex + 1),
      ]);
    }
  };

  const onDishChange = (newItem: Partial<Dish>, oldItem: Dish) => {
    const { id, name, count } = newItem;
    const { id: oldId } = oldItem;
    setSelectedDishes((pre) => {
      const index = findIndex(pre, (i) => i.id === oldId);
      const one = pre[index];
      return [
        ...pre.slice(0, index),
        {
          ...one,
          id: id || one.id,
          name: name || one.name,
          count: count || one.count || 1,
        },
        ...pre.slice(index + 1),
      ];
    });

    // enable the old dish in the options
    const oldIndex = findIndex(dishOptions, ['value', oldId]);
    if (oldIndex > -1) {
      setDishOptions((pre) => [
        ...pre.slice(0, oldIndex),
        {
          ...dishOptions[oldIndex],
          disabled: false,
        },
        ...pre.slice(oldIndex + 1),
      ]);
    }

    // disable the new dish in the options
    const newIndex = findIndex(dishOptions, ['value', id]);
    setDishOptions((pre) => [
      ...pre.slice(0, newIndex),
      {
        ...dishOptions[newIndex],
        disabled: true,
      },
      ...pre.slice(newIndex + 1),
    ]);
  };

  return (
    <>
      <div className="form-item two-column">
        <div className="form-item-left">Please Select a Dish</div>
        <div>Please enter no. of servings</div>
      </div>
      {selectedDishes.map((item) => (
        <div className="form-item two-column" key={item.id}>
          <Select
            className="form-item-left"
            value={item.name ? item.id : ''}
            style={{ width: 220 }}
            // @ts-ignore is not DishOption[]
            onChange={(value, option: DishOption) =>
              onDishChange({ id: option.value, name: option.label }, item)
            }
            options={dishOptions}
          />

          <InputNumber
            value={item.count}
            min={1}
            max={10}
            defaultValue={1}
            onChange={(value) => onDishChange({ count: value as number }, item)}
          />

          <Button
            danger
            shape="circle"
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => deleteDish(item)}
            style={{ marginLeft: 40 }}
          />
        </div>
      ))}

      <div className="form-item">
        <Button shape="circle" icon={<PlusOutlined />} onClick={addDishes} />
      </div>

      <div style={{ color: 'red', whiteSpace: 'pre-wrap' }}>{errorMessage}</div>
    </>
  );
}
