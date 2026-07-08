// Prikazuje najavljene (neaktivne) događaje čiji datum je u budućnosti.
// Renderuje se samo ako postoje takvi događaji — inače returns null.
// Dizajn prati UpcommingEvents: our-team-title, section-divider, teal redovi.
const UnconfirmedEventsTable = ({ events = [] }) => {
  if (!events.length) return null;

  return (
    <div className="w-full bg-[#F0F0F0]">
      <div
        className="w-full blogs-container pt-12 grid place-items-start mx-auto pb-12"
        style={{ justifySelf: 'center', maxWidth: '1400px', padding: '0 30px 48px' }}
      >
        <span className="our-team-title">Najavljeni događaji</span>

        {/* Divider */}
        <div style={{ width: '100%', borderTop: '1px solid #1B1B1B', margin: '8px 0 24px' }} />

        {/* Tabela sa teal redovima — isti stil kao UpcommingEvents */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
            <tbody>
              {events.map((ev, i) => (
                <tr key={ev.id || i}>
                  <td
                    style={{
                      background: '#56C4CF',
                      padding: '16px 24px',
                      borderRadius: '102px 0 0 102px',
                      fontFamily: 'Open Sans, sans-serif',
                      fontSize: '18px',
                      fontWeight: 400,
                      color: '#1B1B1B',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '60vw',
                    }}
                  >
                    {ev.title}
                  </td>
                  <td
                    style={{
                      background: '#56C4CF',
                      padding: '16px 24px',
                      borderRadius: '0 102px 102px 0',
                      fontFamily: 'Open Sans, sans-serif',
                      fontSize: '18px',
                      fontWeight: 400,
                      color: '#1B1B1B',
                      textAlign: 'right',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {ev.date || ev.dateTime || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{
          marginTop: '12px',
          fontFamily: 'Open Sans, sans-serif',
          fontSize: '13px',
          color: '#666',
        }}>
          * Datumi najavljenih događaja su okvirni i podložni promeni.
        </p>
      </div>
    </div>
  );
};

export default UnconfirmedEventsTable;
