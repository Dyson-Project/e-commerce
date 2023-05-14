export default function numberOnly(event: any): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
  if(charCode > 31 && (charCode < 48 || charCode > 57)){
    return false;
  }
  return true;
}
