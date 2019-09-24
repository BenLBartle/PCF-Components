import * as React from 'react';
import { Facepile, IFacepileProps, OverflowButtonType, IFacepilePersona } from 'office-ui-fabric-react/lib/Facepile';
import signalR = require('@aspnet/signalr');
import { PersonaInitialsColor } from 'office-ui-fabric-react/lib/Persona';
import { Text } from 'office-ui-fabric-react/lib/Text';
import { Stack } from 'office-ui-fabric-react/lib/Stack';

export interface IFacepileState {
    personas: IFacepilePersona[]
}

const tokens = {
    sectionStack: {
        childrenGap: 10
    },
    headingStack: {
        childrenGap: 5
    }
};

export class D365Facepile extends React.Component<IFacepileProps, IFacepileState> {
    constructor(props: IFacepileProps) {
        super(props);

        this.state = {
            personas: []
        };

        var connection = new signalR.HubConnectionBuilder().withUrl("http://localhost:5080/d365Hub/?UserId=Ben" + this.makeid(5) + "&RecordId=1").build();

        //Disable send button until connection is established

        connection.on("UserConnected", user => {
            this.setState({
                personas: this.state.personas.concat(this.createPersona(user))
            });
        });

        connection.on("UserDisconnected", user => {
            this.setState({
                personas: this.state.personas.filter(p => {
                    return p.personaName != user[0]
                })
            })
        });

        connection.start();
    }

    private createPersona(user: any): IFacepilePersona | ConcatArray<IFacepilePersona> {
        return {
            imageUrl: 'https://org3a182f51.crm11.dynamics.com/Image/download.aspx?Entity=systemuser&Attribute=entityimage&Id=f78e4117-a746-49a1-a249-30b6e4636987&Timestamp=637049256921404120',
            imageInitials: 'BB',
            personaName: user,
            initialsColor: PersonaInitialsColor.green,
            data: '25%'
        };
    }

    private makeid(length: number) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

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

        return (
            <Stack tokens={tokens.headingStack}>
                <Text variant={'small'} block>
                    Connected Users
              </Text>
                <Facepile {...facepileProps} />
            </Stack>
            );
    }
}