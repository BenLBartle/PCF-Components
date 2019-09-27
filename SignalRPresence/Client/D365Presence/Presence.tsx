import * as React from 'react';
import { Facepile, IFacepileProps, OverflowButtonType, IFacepilePersona } from 'office-ui-fabric-react/lib/Facepile';
import signalR = require('@aspnet/signalr');
import { PersonaInitialsColor } from 'office-ui-fabric-react/lib/Persona';
import { Text } from 'office-ui-fabric-react/lib/Text';
import { Stack } from 'office-ui-fabric-react/lib/Stack';

export interface IFacepileState {
    personas: IFacepilePersona[]
}

export interface IXrmFacepileProps extends IFacepileProps {
    webApi: ComponentFramework.WebApi,
    signalRUrl: string,
    userId: string,
    recordId: string
}

const tokens = {
    sectionStack: {
        childrenGap: 10
    },
    headingStack: {
        childrenGap: 5
    }
};

export class D365Facepile extends React.Component<IXrmFacepileProps, IFacepileState> {
    constructor(props: IXrmFacepileProps) {
        super(props);

        this.state = {
            personas: []
        };

        var connection = new signalR.HubConnectionBuilder()
            .withUrl(`${this.props.signalRUrl}?UserId=${this.props.userId}&RecordId=${this.props.recordId}`)
            .build();

        connection.on("UserConnected", userid => {
            if (userid != this.props.userId && !this.state.personas.some(p => p.id == userid)) {
                this.createPersona(userid)
                    .then(persona => {
                        this.setState({
                            personas: this.state.personas.concat(persona)
                        });
                    })
            }
        });

        connection.on("UserDisconnected", userid => {
            if (userid != this.props.userId) {
                this.setState({
                    personas: this.state.personas.filter(p => {
                        return p.id != userid
                    })
                })
            }
        });

        connection.start();
    }

    private async createPersona(userid: string): Promise<IFacepilePersona> {

        const systemUser = await this.props.webApi.retrieveRecord('systemuser', userid);

        return {
            id: userid,
            imageUrl: systemUser.entityimage_url,
            imageInitials: this.getInitials(systemUser.fullname),
            personaName: systemUser.fullname,
            initialsColor: PersonaInitialsColor.green,
            data: '25%'
        };
    }

    private getInitials(name: string) {
        var names = name.split(' '),
            initials = names[0].substring(0, 1).toUpperCase();

        if (names.length > 1) {
            initials += names[names.length - 1].substring(0, 1).toUpperCase();
        }
        return initials;
    };

    public render(): JSX.Element {
        const facepileProps: IFacepileProps = {
            personas: this.state.personas,
            maxDisplayablePersonas: 5,
            overflowButtonProps: {
                ariaLabel: 'More users',
            },
            overflowButtonType: OverflowButtonType.descriptive,
            showAddButton: false,
            ariaDescription: 'To move through the items use left and right arrow keys.'
        };

        return <Facepile {...facepileProps} />;
    }
}