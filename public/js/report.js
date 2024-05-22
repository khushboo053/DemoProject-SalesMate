document.getElementsById("reportForm").addEventListener('submit', function(event) {
    event.preventDefault();

    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    const url = `/generate-report?startDate=${startDate}&endDate=${endDate}`;

    window.open(url, '_blank');
})