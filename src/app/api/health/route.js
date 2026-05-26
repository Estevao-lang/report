export function GET() {
  return Response.json({
    ok: true,
    service: 'my-reports',
    timestamp: new Date().toISOString(),
  });
}
