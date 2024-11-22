import { Html } from '@react-email/html';
import * as React from 'react';
import { Head } from '@react-email/head';
import { Img } from '@react-email/img';
import { Container } from '@react-email/container';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';

export interface Props {
    name: string;
    slot: string;
    seats: number;
}

export default function BibleConfirm(props: Props) {
    const { name, slot, seats } = props;

    return (
        <Html lang='de'>
        <Head />
        <Section style={main}>
          <Container style={container}>
            <Container style={{ ...paragraph, ...logo}}>
              <Img style={logoImg} src="https://rdibuhxtxlvopgufcpzt.supabase.co/storage/v1/object/sign/main-bucket/logo_black.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtYWluLWJ1Y2tldC9sb2dvX2JsYWNrLnBuZyIsImlhdCI6MTczMjI3NTkxNSwiZXhwIjo0ODU0MzM5OTE1fQ.yLpKcq-PNr7gL0_jC2zUZQ_1ISqMu2siVINy_t7yJg8&t=2024-11-22T11%3A45%3A15.640Z" />
              <Text>FECG Speyer/Schwegenheim</Text>
            </Container>

            <Container style={content}>

              <Container style={boxInfos}>
                <Container>
                  <Text
                    style={{
                      ...paragraph,
                      fontSize: 20,
                      fontWeight: 'bold',
                    }}
                  >
                    Shalom {name},
                  </Text>
                  <Text
                    style={{
                      ...paragraph,
                      fontSize: 16,
                      fontWeight: 'normal',
                    }}
                  >
                    vielen Dank für die Anmeldung. Diese ist hiermit bestätigt. Falls sich Änderungen unsererseits ergeben sollten, werden wir dich kontaktieren.
                  <br></br>
                  <br></br>
                    Bei Fragen, Anregunden oder einer <b>Stornierung</b>, antworte einfach auf diese Email, oder einfach eine Email an <a href='mailto:bibelausstellung@fecg-speyer.de'>bibelausstellung@fecg-speyer.de</a>. Wir helfen dir gerne weiter.
                  <br></br>
                  <br></br>
                    <b>Buchungsdetails</b>
                  <br></br>
                    Datum & Uhrzeit: {slot}
                  <br></br>
                    Personenanzahl: {seats}
                  <br></br>
                  <br></br>
                    Mit Gottes Segen,
                  <br></br>
                    FECG Speyer/Schwegenheim
                  </Text>
                </Container>
              </Container>
            </Container>

            <Text
              style={{
                ...paragraph,
                textAlign: 'center',
                fontSize: 12,
                color: 'rgb(0,0,0, 0.7)',
              }}
            >
              © 2024 | <a style={{ textDecoration: "none", color: "rgb(0,0,0, 0.7)", fontSize: "12px" }} href='https://www.fecg-speyer.de'>www.fecg-speyer.de</a>
            </Text>
          </Container>
        </Section>
      </Html>
    );
}

const logoImg = {
    height: "60px",
    width: "60px",
    paddingRight: "10px",
};

const fontFamily =
  '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif';

const main = {
  backgroundColor: '#fff',
};

const paragraph = {
  fontSize: 16,
  fontFamily,
};

const container = {
  width: '620px',
  margin: '0 auto',
};

const logo = {
  display: 'flex',
  padding: '10px 10px',
};

const containerButton = {
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
};

const button = {
  backgroundColor: '#438e96',
  padding: '12px 30px',
  borderRadius: 3,
  color: '#FFF',
  fontWeight: 'bold',
  border: '1px solid rgb(0,0,0, 0.1)',
  fontFamily,
  cursor: 'pointer',
};

const content = {
  border: '1px solid rgb(0,0,0, 0.1)',
  borderRadius: '3px',
  overflow: 'hidden',
  gridAutoFlow: 'row',
};

const boxInfos = {
  padding: '20px 40px',
};

const headerImgStyle: any = {
    height: "300px",
    objectFit: "cover",
};
