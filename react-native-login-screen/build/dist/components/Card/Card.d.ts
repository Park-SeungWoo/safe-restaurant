/// <reference types="react" />
export interface ICardProps {
    value?: string;
    iconComponent?: any;
    placeholder?: string;
    secureTextEntry?: boolean;
    onChangeText?: (text: string) => void;
}
declare const Card: {
    (props: ICardProps): JSX.Element;
    defaultProps: {
        placeholder: string;
    };
};
export default Card;
