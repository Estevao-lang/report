import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const PAGE_W  = 468;
const PAGE_PW = 612;

const s = StyleSheet.create({
  page: {
    fontFamily:    'Helvetica',
    fontSize:       9.5,
    color:         '#1a1a1a',
    paddingTop:     60,
    paddingBottom:  60,
    paddingLeft:    72,
    paddingRight:   72,
    backgroundColor: '#ffffff',
  },
  footer: {
    position:  'absolute',
    bottom:     18,
    left:        0,
    width:      PAGE_PW,
    textAlign: 'center',
    fontSize:    7,
    color:       '#888',
    fontFamily: 'Helvetica',
  },
  pageNum: {
    position:  'absolute',
    bottom:     18,
    right:      72,
    fontSize:    7,
    color:       '#888',
  },
  headerLogo: {
    position:  'absolute',
    top:        18,
    left:       72,
    width:      60,
    height:     20,
    objectFit: 'contain',
    opacity:    0.5,
  },

  // Cover / title
  coverWrap: { marginTop: 60, marginBottom: 40, alignItems: 'center' },
  coverTitle: {
    fontFamily:   'Helvetica-Bold',
    fontSize:      13,
    color:        '#1A3C5E',
    textAlign:    'center',
    marginBottom:  4,
  },
  coverSub: {
    fontSize:   10,
    color:      '#444',
    textAlign: 'center',
    marginBottom: 2,
  },
  dividerBar: {
    width:           PAGE_W,
    height:            2,
    backgroundColor: '#C92234',
    marginVertical:   16,
  },

  // Section
  sectionNum: {
    fontFamily:   'Helvetica-Bold',
    fontSize:      10,
    color:        '#1A3C5E',
    marginTop:     16,
    marginBottom:   4,
  },
  en: {
    fontSize:    9.5,
    color:       '#1a1a1a',
    lineHeight:  1.55,
    marginBottom: 3,
  },
  pt: {
    fontSize:    9.5,
    color:       '#444',
    fontFamily: 'Helvetica-Oblique',
    lineHeight:  1.55,
    marginBottom: 6,
  },
  bulletRow: { flexDirection: 'row', marginLeft: 10, marginBottom: 2 },
  bulletDot: { width: 12, fontSize: 9.5, color: '#1a1a1a' },
  bulletEn:  { flex: 1, fontSize: 9.5, color: '#1a1a1a', lineHeight: 1.5 },
  bulletPt:  { flex: 1, fontSize: 9.5, color: '#444', fontFamily: 'Helvetica-Oblique', lineHeight: 1.5 },

  // Signatures
  sigSection: { marginTop: 32 },
  sigTitle: {
    fontFamily:   'Helvetica-Bold',
    fontSize:      10,
    color:        '#1A3C5E',
    marginBottom: 16,
  },
  sigRow: { flexDirection: 'row', width: PAGE_W, gap: 24, marginBottom: 20 },
  sigBlock: { flex: 1 },
  sigLabel: { fontFamily: 'Helvetica-Bold', fontSize: 9, color: '#1A3C5E', marginBottom: 8 },
  sigLine: { borderBottomWidth: 0.75, borderBottomColor: '#999', width: '100%', marginBottom: 4 },
  sigMeta: { fontSize: 8, color: '#555', marginBottom: 2 },

  // Envelope ID bar
  envelopeBar: {
    position:   'absolute',
    top:         10,
    left:        72,
    right:       72,
    fontSize:     7,
    color:       '#aaa',
    textAlign:  'right',
  },
});

function Bullet({ en, pt }) {
  return (
    <View>
      <View style={s.bulletRow}>
        <Text style={s.bulletDot}>•</Text>
        <Text style={s.bulletEn}>{en}</Text>
      </View>
      <View style={s.bulletRow}>
        <Text style={s.bulletDot}> </Text>
        <Text style={s.bulletPt}>{pt}</Text>
      </View>
    </View>
  );
}

function Section({ num, title, titlePt, children }) {
  return (
    <View>
      <Text style={s.sectionNum}>{num}. {title} / {titlePt}</Text>
      {children}
    </View>
  );
}

export function ContractDocument({ data, logoSrc }) {
  const {
    contractorName    = 'CONTRACTOR NAME',
    contractorCNPJ    = '00.000.000/0001-00',
    contractorCPF     = '000.000.000-00',
    contractorAddress = 'Address, Brazil',
    monthlyFee        = '7.000,00',
    monthlyFeeWords   = 'seven thousand',
    monthlyFeeWordsPt = 'sete mil',
    paymentDay        = '4',
    contractDate      = '',
    invoiceNoticeDays = '5',
  } = data;

  const footer = 'SNAVEUK LTD  STUDIO 42  THE GLASS BOX  6 FRIENDLY STREET  HUDDERSFIELD  HD1 1RD';

  return (
    <Document
      title="Service Agreement – Software Development"
      author="Snave UK Ltd"
      creator="My Reports"
      producer="My Reports"
    >
      {/* ── Page 1 ── */}
      <Page size="LETTER" style={s.page}>
        {logoSrc && <Image src={logoSrc} style={s.headerLogo} fixed />}
        <Text style={s.footer} fixed>{footer}</Text>
        <Text style={s.pageNum} fixed render={({ pageNumber }) => String(pageNumber)} />

        {/* Title */}
        <View style={s.coverWrap}>
          <Text style={s.coverTitle}>SERVICE AGREEMENT / CONTRATO DE PRESTAÇÃO DE SERVIÇOS</Text>
          <Text style={s.coverSub}>DE DESENVOLVIMENTO DE SOFTWARE</Text>
          <View style={s.dividerBar} />
          <Text style={[s.en, { textAlign: 'center', marginBottom: 2 }]}>
            This Agreement is entered into by and between:
          </Text>
          <Text style={[s.pt, { textAlign: 'center' }]}>
            O presente Contrato é firmado entre:
          </Text>
        </View>

        <Section num="1" title="THE CLIENT" titlePt="A CONTRATANTE">
          <Text style={s.en}>
            SNAVE UK LTD, a private limited company incorporated under the laws of England and Wales,
            Company No. 11785742, with registered office at Studio 42, The Glass Box, Huddersfield
            HD1 1RD, United Kingdom, herein represented by its legal representative, Mr. Adam Evans,
            hereinafter referred to as "CLIENT".
          </Text>
          <Text style={s.pt}>
            SNAVE UK LTD, sociedade limitada registrada sob as leis da Inglaterra e País de Gales,
            CNPJ nº 11785742, com sede em Studio 42, The Glass Box, Huddersfield HD1 1RD, Reino Unido,
            neste ato representada por seu representante legal, Sr. Adam Evans, doravante denominada "CONTRATANTE".
          </Text>
        </Section>

        <Section num="2" title="THE CONTRACTOR" titlePt="A CONTRATADA">
          <Text style={s.en}>
            {contractorName.toUpperCase()}, registered under CNPJ nº {contractorCNPJ}, with principal
            office at {contractorAddress}, CPF nº {contractorCPF}, hereinafter referred to as "CONTRACTOR".
          </Text>
          <Text style={s.pt}>
            {contractorName.toUpperCase()}, inscrito no CNPJ nº {contractorCNPJ}, com sede em{' '}
            {contractorAddress}, CPF nº {contractorCPF}, doravante denominado "CONTRATADO".
          </Text>
        </Section>

        <Section num="3" title="SCOPE OF WORK" titlePt="OBJETO DO CONTRATO">
          <Text style={s.en}>
            The CONTRACTOR agrees to provide independent full-time software development services,
            including but not limited to:
          </Text>
          <Text style={s.pt}>
            O CONTRATADO compromete-se a prestar serviços de desenvolvimento de software em tempo integral,
            incluindo, mas não se limitando a:
          </Text>
          <Bullet
            en="Back-end and front-end development;"
            pt="Desenvolvimento back-end e front-end;"
          />
          <Bullet
            en="API integrations and deployment configurations;"
            pt="Integração de APIs e configurações de ambiente;"
          />
          <Bullet
            en="Code maintenance, testing, performance optimisation, and documentation;"
            pt="Manutenção de código, testes, otimização de desempenho e documentação;"
          />
          <Bullet
            en="Compliance with good engineering practices and data protection obligations."
            pt="Conformidade com boas práticas de engenharia e proteção de dados."
          />
        </Section>

        <Section num="4" title="TERM AND TERMINATION" titlePt="PRAZO E RESCISÃO">
          <Text style={s.en}>
            This Agreement shall commence on the date of signature and shall remain in effect for an
            indefinite period, unless terminated by either party with 30 (thirty) days' written notice.
          </Text>
          <Text style={s.pt}>
            Este contrato terá início na data da assinatura e vigorará por prazo indeterminado, salvo
            rescisão por qualquer das partes com aviso prévio de 30 (trinta) dias.
          </Text>
        </Section>
      </Page>

      {/* ── Page 2 ── */}
      <Page size="LETTER" style={s.page}>
        {logoSrc && <Image src={logoSrc} style={s.headerLogo} fixed />}
        <Text style={s.footer} fixed>{footer}</Text>
        <Text style={s.pageNum} fixed render={({ pageNumber }) => String(pageNumber)} />

        <Section num="5" title="FEES AND PAYMENT" titlePt="VALOR E PAGAMENTO">
          <Text style={s.en}>
            The CLIENT agrees to pay the CONTRACTOR the sum of R$ {monthlyFee} ({monthlyFeeWords} Reais)
            per month for full-time services, via bank transfer, on or around the {paymentDay}th of each month.
          </Text>
          <Text style={s.pt}>
            A CONTRATANTE pagará ao CONTRATADO o valor de R$ {monthlyFee} ({monthlyFeeWordsPt} reais)
            por mês pelos serviços em tempo integral, via transferência bancária, por volta do dia{' '}
            {paymentDay} de cada mês.
          </Text>
          <Text style={s.en}>
            The CONTRACTOR shall issue an invoice at least {invoiceNoticeDays} business days before the due date.
          </Text>
          <Text style={s.pt}>
            O CONTRATADO deverá emitir a nota fiscal com pelo menos {invoiceNoticeDays} dias úteis de
            antecedência à data do vencimento.
          </Text>
        </Section>

        <Section num="6" title="INTELLECTUAL PROPERTY" titlePt="PROPRIEDADE INTELECTUAL">
          <Text style={s.en}>
            All code, deliverables, and documentation produced under this Agreement shall be the exclusive
            property of the CLIENT.
          </Text>
          <Text style={s.pt}>
            Todo o código, entregas e documentação produzidos sob este contrato serão de propriedade
            exclusiva da CONTRATANTE.
          </Text>
        </Section>

        <Section num="7" title="CONFIDENTIALITY" titlePt="CONFIDENCIALIDADE">
          <Text style={s.en}>
            The parties agree to maintain strict confidentiality for all technical, commercial, or strategic
            information.
          </Text>
          <Text style={s.pt}>
            As partes concordam em manter sigilo sobre todas as informações técnicas, comerciais ou estratégicas.
          </Text>
          <Text style={s.en}>This obligation shall remain in force during the term and for 5 years after termination.</Text>
          <Text style={s.pt}>Esta obrigação permanecerá vigente durante o contrato e por 5 anos após seu encerramento.</Text>
        </Section>

        <Section num="8" title="DATA PROTECTION" titlePt="PROTEÇÃO DE DADOS">
          <Text style={s.en}>If personal data is processed during service delivery:</Text>
          <Text style={s.pt}>Se houver tratamento de dados pessoais durante a execução:</Text>
          <Bullet
            en="The CLIENT shall be the Controller, and the CONTRACTOR the Processor;"
            pt="O CONTRATANTE será o Controlador e o CONTRATADO o Operador;"
          />
          <Bullet
            en="Security incidents must be reported within 24 hours."
            pt="Incidentes de segurança devem ser reportados em até 24 horas."
          />
        </Section>

        <Section num="9" title="FORCE MAJEURE" titlePt="FORÇA MAIOR">
          <Text style={s.en}>
            Neither party shall be liable for delays caused by force majeure, provided notice is given
            within 5 days.
          </Text>
          <Text style={s.pt}>
            Nenhuma parte será responsabilizada por atrasos causados por força maior, desde que notificada
            em até 5 dias.
          </Text>
        </Section>

        <Section num="10" title="NATURE OF RELATIONSHIP" titlePt="NATUREZA DA RELAÇÃO">
          <Text style={s.en}>
            This Agreement does not create an employment, partnership, agency, or exclusive relationship.
          </Text>
          <Text style={s.pt}>
            Este contrato não cria vínculo empregatício, societário, de representação ou de exclusividade.
          </Text>
        </Section>

        <Section num="11" title="GOVERNING LAW AND JURISDICTION" titlePt="LEI APLICÁVEL E FORO">
          <Text style={s.en}>
            This Agreement shall be governed by the laws of England and Wales, and any disputes shall be
            resolved exclusively by the courts of the United Kingdom.
          </Text>
          <Text style={s.pt}>
            Este contrato será regido pelas leis da Inglaterra e País de Gales, e qualquer disputa será
            resolvida exclusivamente nos tribunais do Reino Unido.
          </Text>
        </Section>

        {/* Signatures */}
        <View style={s.sigSection}>
          <Text style={s.sigTitle}>SIGNATURES / ASSINATURAS</Text>
          <View style={s.sigRow}>
            <View style={s.sigBlock}>
              <Text style={s.sigLabel}>CLIENT / CONTRATANTE</Text>
              <Text style={s.sigMeta}>Name: Adam Evans</Text>
              <Text style={s.sigMeta}>Position: Director, SNAVE UK Ltd</Text>
              <Text style={s.sigMeta}>Date: {contractDate || '____ / ____ / ______'}</Text>
              <View style={{ marginTop: 24 }}>
                <View style={s.sigLine} />
                <Text style={[s.sigMeta, { marginTop: 2 }]}>Signature</Text>
              </View>
            </View>
            <View style={s.sigBlock}>
              <Text style={s.sigLabel}>CONTRACTOR / CONTRATADO</Text>
              <Text style={s.sigMeta}>Name: {contractorName}</Text>
              <Text style={s.sigMeta}>CPF: {contractorCPF}</Text>
              <Text style={s.sigMeta}>Date: {contractDate || '____ / ____ / ______'}</Text>
              <View style={{ marginTop: 24 }}>
                <View style={s.sigLine} />
                <Text style={[s.sigMeta, { marginTop: 2 }]}>Signature</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
