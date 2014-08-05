<div>
  <h2 class="page-title">Results</h2>
</div>
<div id='wrapper'>
  <table class="table table-striped table-hover">
    <thead>
      <tr>
        <th>
          URL Path
        </th>
        <th>
          Number of Requests
        </th>
        <th>
          Average Execution Time
        </th>
      </tr>
    </thead>
    <tbody>
      <% for(timer in MetricsFilter.Metrics.Timers.entrySet())  {%>
      <tr>
        <td>
          <a href='metering/${java.net.URLEncoder.encode(timer.Key, 'UTF-8')}'>${timer.Key.replace(MetricsFilter.TimerDelimiter, '')}</a>
        </td>
        <td>
          ${timer.Value.Count}
        </td>
        <td>
          ${String.format("%.5g%n", {timer.Value.Snapshot.Mean/(1e9)}) + ' seconds'}
        </td>
     </tr>
     <% } %>
    </tbody>
  </table>
</div>