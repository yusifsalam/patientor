import React from "react";
import { Icon } from "semantic-ui-react";

export const HealthCheckRating: React.FC<{ rating: number }> = ({ rating }) => {
    switch (rating) {
        case 0:
            return (
                <p>
                    <Icon color="green" name="heart" />
                </p>
            );
        case 1:
            return (
                <p>
                    <Icon color="yellow" name="heart" />
                </p>
            );
        case 2:
            return (
                <p>
                    <Icon color="orange" name="heart" />
                </p>
            );
        case 3:
            return (
                <p>
                    <Icon color="red" name="heart" />
                </p>
            );
        default:
            return <div />;
    }
};
