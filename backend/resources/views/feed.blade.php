<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Spam Caller Wall of Shame</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background-color: #121212; color: #e0e0e0; font-family: 'Inter', sans-serif; }
        .card { background-color: #1e1e1e; }
    </style>
</head>
<body class="p-6">

    <div class="max-w-4xl mx-auto">
        <header class="mb-8 text-center">
            <h1 class="text-4xl font-bold text-red-500 mb-2">🚫 Wall of Shame</h1>
            <p class="text-gray-400">Public list of confirmed spam numbers detected by our community.</p>
        </header>

        <div class="grid gap-4">
            @foreach ($numbers as $number)
            <div class="card p-4 rounded-lg shadow-lg flex justify-between items-center border border-gray-800">
                <div>
                    <h2 class="text-xl font-bold text-white tracking-wider font-mono">
                        {{ substr($number->phone_number, 0, -3) }}***
                    </h2>
                    <p class="text-sm text-red-400 mt-1">{{ $number->reason ?? 'Reported as Spam' }}</p>
                </div>
                <div class="text-right">
                    <span class="text-xs bg-gray-800 px-2 py-1 rounded text-gray-500">{{ $number->source }}</span>
                    <p class="text-xs text-gray-500 mt-2">{{ $number->created_at->diffForHumans() }}</p>
                </div>
            </div>
            @endforeach
        </div>

        <footer class="mt-12 text-center text-gray-600 text-sm">
            <p>API Access: <a href="/api/public/feed" class="text-blue-500 underline">/api/public/feed</a></p>
            <p>&copy; {{ date('Y') }} Spam Caller Defense System</p>
        </footer>
    </div>

</body>
</html>
